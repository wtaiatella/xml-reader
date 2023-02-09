import React, { useContext, useState, useRef } from 'react';
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
	Tag,
	Checkbox,
	Switch,
} from 'antd';
import Draggable from 'react-draggable';

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
	const inputNode =
		inputType === 'number' ? (
			<InputNumber />
		) : (
			<Switch defaultChecked={record?.hasRightMenu} />
		);
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

export function TableModal({ open, setOpen, selectedWorldmapsKeys }) {
	const { xmlData, setXmlData } = useContext(UserContext);
	const [confirmLoading, setConfirmLoading] = useState(false);
	const [sizeSelected, setSizeSelected] = useState('');
	const [selectedRowKeys, setSelectedRowKeys] = useState([]);
	const [disabled, setDisabled] = useState(false);
	const [form] = Form.useForm();
	const [editingKey, setEditingKey] = useState('');
	const [bounds, setBounds] = useState({
		left: 0,
		top: 0,
		bottom: 0,
		right: 0,
	});
	const draggleRef = useRef(null);

	const isEditing = (key) => key === editingKey;

	const edit = (record) => {
		console.log('record');
		console.log(record.key);
		form.setFieldsValue({
			...record,
		});
		setEditingKey(record.key);
	};

	const cancel = () => {
		setEditingKey('');
	};

	const save = async (key) => {
		//update
		try {
			const row = await form.validateFields();
			const newData = [...xmlData.xmlConfig];
			const index = newData.findIndex((item) => key === item.key);
			if (index > -1) {
				const item = newData[index];
				newData.splice(index, 1, {
					...item,
					...row,
				});
				setXmlData({
					...xmlData,
					xmlConfig: newData,
				});
				console.log('novos dados');
				console.log(
					JSON.stringify({
						...item,
						...row,
					})
				);
				await fetch(`/api/xmlConfig/${key}`, {
					method: 'PUT',
					headers: { 'Content-Type': 'application/json' },
					where: { key: { key } },
					body: JSON.stringify({
						...item,
						...row,
					}),
				});
				setEditingKey('');
			}
		} catch (errInfo) {
			console.log('Validate Failed:', errInfo);
		}
	};

	const handleNewSize = () => {
		//post
		const submitData = async () => {
			const response = await fetch('/api/xmlConfig/', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
			});
			const resp = await response.json();

			console.log('Lista de sizes');
			console.log(resp);

			const newData = [...xmlData.xmlConfig];
			newData.push(resp);

			setXmlData({
				...xmlData,
				xmlConfig: newData,
			});
			form.setFieldsValue({
				...resp,
			});
			setEditingKey(resp.key);
		};
		submitData();
	};

	const handleDeleteSize = async (key) => {
		await fetch(`/api/xmlConfig/${key}`, {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json' },
			where: { key: { key } },
		});

		const newData = xmlData.xmlConfig.filter((item) => item.key !== key);
		setXmlData({
			...xmlData,
			xmlConfig: newData,
		});
	};

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
			title: 'Margem Dir?',
			dataIndex: 'hasRightMenu',
			key: 'hasRightMenu',
			width: '13%',
			editable: true,
			render: (hasRightMenu) => {
				let color = hasRightMenu ? 'green' : 'volcano';
				let valor = hasRightMenu ? 'sim' : 'não';

				return (
					<Tag color={color} key={hasRightMenu}>
						{valor.toUpperCase()}
					</Tag>
				);
			},
		},
		{
			title: 'Action',
			key: 'operation',
			fixed: 'right',
			width: 100,
			render: (_, record) => {
				const editable = isEditing(record.key);
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
					<span>
						<Typography.Link
							disabled={editingKey !== ''}
							onClick={() => edit(record)}
							style={{
								marginRight: 8,
							}}
						>
							Editar
						</Typography.Link>
						<Popconfirm
							disabled={editingKey !== ''}
							title='Confirma apagar?'
							onConfirm={() => handleDeleteSize(record.key)}
						>
							<a>Apagar</a>
						</Popconfirm>
					</span>
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
			onCell: (record) => {
				return {
					record,
					inputType:
						col.dataIndex === 'hasRightMenu' ? 'boolean' : 'number',
					dataIndex: col.dataIndex,
					title: col.title,
					editing: isEditing(record.key),
				};
			},
		};
	});

	const onStart = (_event, uiData) => {
		const { clientWidth, clientHeight } = window.document.documentElement;
		const targetRect = draggleRef.current?.getBoundingClientRect();
		if (!targetRect) {
			return;
		}
		setBounds({
			left: -targetRect.left + uiData.x,
			right: clientWidth - (targetRect.right - uiData.x),
			top: -targetRect.top + uiData.y,
			bottom: clientHeight - (targetRect.bottom - uiData.y),
		});
	};

	return (
		<Container>
			<Modal
				title={
					<div
						style={{
							width: '100%',
							cursor: 'move',
						}}
						onMouseOver={() => {
							if (disabled) {
								setDisabled(false);
							}
						}}
						onMouseOut={() => {
							setDisabled(true);
						}}
					>
						Seleção dos ajustes da tela
					</div>
				}
				open={open}
				confirmLoading={confirmLoading}
				width={1000}
				centered
				modalRender={(modal) => (
					<Draggable
						disabled={disabled}
						bounds={bounds}
						onStart={(event, uiData) => onStart(event, uiData)}
					>
						<div ref={draggleRef}>{modal}</div>
					</Draggable>
				)}
				footer={[
					<Button key='add' type='primary' onClick={handleNewSize}>
						Novo ajuste
					</Button>,

					<Button key='back' onClick={handleModalCancel}>
						Cancel
					</Button>,
					<Button
						key='submit'
						type='primary'
						loading={confirmLoading}
						onClick={handleModalOk}
					>
						Ok
					</Button>,
				]}
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
						dataSource={xmlData.xmlConfig}
						pagination={false}
					/>
				</Form>
			</Modal>
		</Container>
	);
}
