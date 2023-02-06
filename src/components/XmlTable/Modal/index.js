import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../../../contexts/UserContext';
import { Container } from './styles';
import { PlusOutlined } from '@ant-design/icons';
import {
	Modal,
	Table,
	Button,
	Input,
	Form,
	InputNumber,
	Typography,
	Popconfirm,
	EditableContext,
} from 'antd';
//import 'antd/dist/antd.css';

const EditableRow = ({ index, ...props }) => {
	const [form] = Form.useForm();
	return (
		<Form form={form} component={false}>
			<EditableContext.Provider value={form}>
				<tr {...props} />
			</EditableContext.Provider>
		</Form>
	);
};

const EditableCell = ({
	editing,
	dataIndex,
	title,
	inputType,
	record,
	index,
	children,
	...restProps
}) => {
	const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
	return (
		<td {...restProps}>
			{editing ? (
				<Form.Item
					name={dataIndex}
					style={{
						margin: 0,
					}}
					rules={[
						{
							required: true,
							message: `Please Input ${title}!`,
						},
					]}
				>
					{inputNode}
				</Form.Item>
			) : (
				children
			)}
		</td>
	);
};

export function TableModal({ open, setOpen, selectedRowKeys }) {
	const { xmlData } = useContext(UserContext);
	const [newSize, setNewSize] = useState('');
	const [confirmLoading, setConfirmLoading] = useState(false);
	const [sizeSelected, setSizeSelected] = useState('');
	const [sizeList, setSizeList] = useState([]);

	const [form] = Form.useForm();

	const [editingKey, setEditingKey] = useState('');

	const isEditing = (record) => record.key === editingKey;

	const edit = (record) => {
		form.setFieldsValue({
			name: '',
			age: '',
			address: '',
			...record,
		});
		setEditingKey(record.key);
	};

	const cancel = () => {
		setEditingKey('');
	};

	const save = async (key) => {
		try {
			const row = await form.validateFields();
			const newData = [...sizeList];
			const index = newData.findIndex((item) => key === item.key);
			if (index > -1) {
				const item = newData[index];
				newData.splice(index, 1, {
					...item,
					...row,
				});
				setSizeList(newData);
				setEditingKey('');
			} else {
				newData.push(row);
				setSizeList(newData);
				setEditingKey('');
			}
		} catch (errInfo) {
			console.log('Validate Failed:', errInfo);
		}
	};

	useEffect(() => {
		if (xmlData.xmlConfig) {
			setSizeList(xmlData.xmlConfig);
		}
	}, [xmlData]);

	console.log('open = ', open);

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
			key: 'oldSizeX',
			width: '12%',
			editable: true,
			sorter: (a, b) => a.oldSizeX - b.oldSizeX,
			sortDirections: ['descend', 'ascend'],
			render: (_, { oldSizeX }) => <>{oldSizeX} px</>,
		},
		{
			title: 'Altura',
			dataIndex: 'oldSizeY',
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
				const editable = isEditing(record);
				return editable ? (
					<span>
						<Typography.Link
							onClick={() => save(record.key)}
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
						onClick={() => edit(record)}
					>
						Edit
					</Typography.Link>
				);
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
	};

	const mergedColumns = columns.map((col) => {
		if (!col.editable) {
			return col;
		}
		return {
			...col,
			onCell: (record) => ({
				record,
				inputType: 'number',
				dataIndex: col.dataIndex,
				title: col.title,
				editing: isEditing(record),
			}),
		};
	});

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
						components={{
							body: {
								cell: EditableCell,
							},
						}}
						bordered
						rowSelection={{
							type: 'radio',
							...rowSelection,
						}}
						columns={mergedColumns}
						dataSource={sizeList}
						pagination={false}
					/>
				</Form>
			</Modal>
		</Container>
	);
}
