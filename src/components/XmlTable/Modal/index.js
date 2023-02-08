import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../../../contexts/UserContext';
import { Container } from './styles';
import {
	Modal,
	Table,
	Button,
	Input,
	Form,
	InputNumber,
	Typography,
	Popconfirm,
} from 'antd';
//import 'antd/dist/antd.css';

export function TableModal({ open, setOpen, selectedWorldmapsKeys }) {
	const { xmlData } = useContext(UserContext);
	const [newSize, setNewSize] = useState('');
	const [confirmLoading, setConfirmLoading] = useState(false);
	const [sizeSelected, setSizeSelected] = useState('');
	const [sizeList, setSizeList] = useState([]);
	const [selectedRowKeys, setSelectedRowKeys] = useState([]);

	const [form] = Form.useForm();

	const [editingKey, setEditingKey] = useState('');

	useEffect(() => {
		//findmany
		const submitData = async () => {
			const response = await fetch('/api/xmlConfig/', {
				method: 'GET',
				headers: { 'Content-Type': 'application/json' },
			});
			const resp = await response.json();
			console.log('Lista de sizes');
			console.log(resp);
			setSizeList(resp);
		};
		submitData();
	}, [setSizeList]);

	const handleModalOk = () => {
		setConfirmLoading(true);

		const xmlWorldmap = xmlData.xml.getElementsByTagName('Worldmap');
		console.log('Modal OK');
		console.log(sizeSelected);
		console.log(xmlWorldmap);
		console.log(selectedRowKeys);

		const sizeXY = sizeSelected.split('x');
		const sizeX = sizeXY[0];
		const sizeY = sizeXY[1];

		for (let selectedWorldmap of selectedRowKeys) {
			for (let worldmap of xmlWorldmap) {
				console.log('selectedWorldmap: ', selectedWorldmap);
				console.log(
					'worldmap.getAttribute(Name): ',
					worldmap.getAttribute('Name')
				);

				if (selectedWorldmap === worldmap.getAttribute('Name')) {
					worldmap.setAttribute('Width', sizeX);
					worldmap.setAttribute('MaxX', sizeX);
					worldmap.setAttribute('Height', sizeY);
					worldmap.setAttribute('MaxY', sizeY);

					const xmlGoView = worldmap.getElementsByTagName('GoView');

					for (let goView of xmlGoView) {
						goView.setAttribute('Width', sizeX);
						goView.setAttribute('Height', sizeY);
						goView.setAttribute('top', 0);
						goView.setAttribute('left', 0);
					}

					console.log(`Worlmap atualizado`);
					console.log(worldmap);
					console.log(xmlData.xml.getElementsByTagName('Worldmap'));
				}
			}
		}

		setTimeout(() => {
			setOpen(false);
			setConfirmLoading(false);
		}, 500);
	};

	const handleModalCancel = () => {
		console.log('Clicked cancel button');
		setOpen(false);
	};

	const columns = [
		{
			title: 'Largura',
			dataIndex: 'oldSizeX',
			key: 'id',
			width: '12%',
			editable: true,
			sorter: (a, b) => a.oldSizeX - b.oldSizeX,
			sortDirections: ['descend', 'ascend'],
			render: (_, { oldSizeX }) => <>{oldSizeX} px</>,
		},
		{
			title: 'Altura',
			dataIndex: 'oldSizeY',
			key: 'oldSizeY',
			width: '12%',
			editable: true,
			sorter: (a, b) => a.oldSizeY - b.oldSizeY,
			sortDirections: ['descend', 'ascend'],
			render: (_, { oldSizeY }) => <>{oldSizeY} px</>,
		},
		{
			title: 'Nova Larg',
			dataIndex: 'newSizeX',
			key: 'newSizeX',
			width: '13%',
			editable: true,
			sorter: (a, b) => a.newSizeX - b.newSizeX,
			sortDirections: ['descend', 'ascend'],
			render: (_, { newSizeX }) => <>{newSizeX} px</>,
		},
		{
			title: 'Nova Alt',
			dataIndex: 'newSizeY',
			key: 'newSizeY',
			width: '13%',
			editable: true,
			sorter: (a, b) => a.newSizeY - b.newSizeY,
			sortDirections: ['descend', 'ascend'],
			render: (_, { newSizeY }) => <>{newSizeY} px</>,
		},
		{
			title: 'Margem Esq',
			dataIndex: 'limitLeft',
			key: 'limitLeft',
			width: '13%',
			editable: true,
			render: (_, { limitLeft }) => <>{limitLeft} px</>,
		},
		{
			title: 'Margem Dir',
			dataIndex: 'limitRight',
			key: 'limitRight',
			width: '13%',
			editable: true,
			render: (_, { limitRight }) => <>{limitRight} px</>,
		},
		{
			title: 'Action',
			key: 'operation',
			fixed: 'right',
			width: 100,
			render: (_, record) => {
				<a>edit</a>;
				/* const editable = isEditing(record.id);
				return editable ? (
					<span>
						<Typography.Link
							onClick={() => save(record.id)}
							style={{
								marginRight: 8,
							}}
						>
							Save
						</Typography.Link>
						<Popconfirm title='Sure to cancel?' onConfirm={cancel}>
							<a>Cancel</a>
						</Popconfirm>
					</span>
				) : (
					<Typography.Link
						disabled={editingKey !== ''}
						onClick={() => edit(record.id)}
					>
						Edit
					</Typography.Link>
				); */
			},
		},
	];

	// rowSelection object indicates the need for row selection
	const rowSelection = {
		onChange: (selectedRowKeys, selectedRows) => {
			console.log(
				`selectedRowKeys: ${selectedRowKeys}`,
				'selectedRows: ',
				selectedRows
			);
		},
		getCheckboxProps: (record) => ({
			disabled: record.name === 'Disabled User', // Column configuration not to be checked
			name: record.name,
		}),
	};

	return (
		<Container>
			<Modal
				title='Seleção dos ajustes da tela'
				open={open}
				onOk={handleModalOk}
				onCancel={handleModalCancel}
				confirmLoading={confirmLoading}
				width={1000}
				centered
			>
				<p>
					Selecione o novo tamanho de tela para os worldmaps marcados.
				</p>
				<Form form={form} component={false}>
					<Table
						bordered
						rowSelection={{
							type: 'radio',
							...rowSelection,
						}}
						columns={columns}
						dataSource={sizeList}
						pagination={false}
					/>
				</Form>
			</Modal>
		</Container>
	);
}
