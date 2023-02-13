import React, { useContext, useState, useRef, useEffect } from 'react';
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
	Switch,
	Highlighter,
	Space,
} from 'antd';
import { SearchOutlined } from '@ant-design/icons';

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
	const { xmlData, setXmlData, worldmapsTable, setWorldmapsTable } =
		useContext(UserContext);
	const [searchText, setSearchText] = useState('');
	const [searchedColumn, setSearchedColumn] = useState('');
	const searchInput = useRef(null);
	const [confirmLoading, setConfirmLoading] = useState(false);
	const [sizeSelected, setSizeSelected] = useState('');
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
		//setConfirmLoading(true);

		console.log('Tela Modal button OK');
		console.log(sizeSelected);
		console.log(selectedWorldmapsKeys);
		const xmlWorldmap = xmlData.xml.getElementsByTagName('Worldmap');
		for (let worldmap of xmlWorldmap) {
			for (let selectedWorldmap of selectedWorldmapsKeys) {
				console.log('selectedWorldmap: ', selectedWorldmap);
				console.log('worldmap.Name: ', worldmap.getAttribute('Name'));

				if (selectedWorldmap === worldmap.getAttribute('Name')) {
					const oldSizeX = worldmap.getAttribute('Width');

					worldmap.setAttribute('Width', sizeSelected.newSizeX);
					worldmap.setAttribute('MaxX', sizeSelected.newSizeX);
					worldmap.setAttribute('Height', sizeSelected.newSizeY);
					worldmap.setAttribute('MaxY', sizeSelected.newSizeY);

					const xmlWorldmapChildrem = worldmap.children;
					console.log(xmlWorldmapChildrem);

					for (let child of worldmap.children) {
						const name = child.tagName;
						console.log('Nome do Nó = ', name);
						if (name == 'GoView') {
							child.setAttribute('Width', sizeSelected.newSizeX);
							child.setAttribute('Height', sizeSelected.newSizeY);
							child.setAttribute('Top', 0);
							child.setAttribute('Left', 0);
						} else {
							const posX = child.getAttribute('left');
							if (
								posX >= sizeSelected.limitRight &&
								sizeSelected.hasRightMenu
							) {
								child.setAttribute(
									'left',
									posX + sizeSelected.newSizeX - oldSizeX
								);
							} else if (posX >= sizeSelected.limitLeft) {
								child.setAttribute(
									'left',
									posX +
										(sizeSelected.newSizeX - oldSizeX) / 2
								);
							}
						}
					}

					const newWorldmapsTable = worldmapsTable.map(
						(worldmapTable) => {
							if (worldmapTable.Name == selectedWorldmap) {
								worldmapTable.newSizeX = sizeSelected.newSizeX;
								worldmapTable.newSizeY = sizeSelected.newSizeY;
								worldmapTable.limitLeft =
									sizeSelected.limitLeft;
								worldmapTable.limitRight =
									sizeSelected.limitRight;
								worldmapTable.hasRightMenu =
									sizeSelected.hasRightMenu;
							}
							return worldmapTable;
						}
					);

					console.log('Nova tabela worldmaps');
					console.log(newWorldmapsTable);

					setWorldmapsTable(newWorldmapsTable);
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

	const handleSearch = (selectedKeys, confirm, dataIndex) => {
		confirm();
		setSearchText(selectedKeys[0]);
		setSearchedColumn(dataIndex);
	};

	const handleReset = async (clearFilters) => {
		clearFilters();
		setSearchText('');
	};

	const getColumnSearchProps = (dataIndex) => ({
		filterDropdown: ({
			setSelectedKeys,
			selectedKeys,
			confirm,
			clearFilters,
			filters = 1000,
		}) => {
			return (
				<div style={{ padding: 8 }}>
					<Input
						ref={searchInput}
						placeholder={`Buscar ${dataIndex}`}
						value={selectedKeys[0]}
						allowClear
						onChange={(e) =>
							setSelectedKeys(
								e.target.value ? [e.target.value] : []
							)
						}
						onPressEnter={() =>
							handleSearch(selectedKeys, confirm, dataIndex)
						}
						//style={{ marginBottom: 8, display: 'block' }}
						style={{
							marginBottom: 8,
							display: 'block',
							width: '300',
							padding: '10px',
						}}
					/>
					<Space>
						<Button
							type='primary'
							onClick={() =>
								handleSearch(selectedKeys, confirm, dataIndex)
							}
							icon={<SearchOutlined />}
							size='small'
							style={{ width: 90 }}
						>
							Buscar
						</Button>
						<Button
							onClick={async () => {
								clearFilters &&
									(await handleReset(clearFilters));
								confirm({ closeDropdown: true });
								setSearchedColumn(dataIndex);
							}}
							size='small'
							style={{ width: 90 }}
						>
							Reset
						</Button>
					</Space>
				</div>
			);
		},
		filterIcon: (filtered) => (
			<SearchOutlined
				style={{ color: filtered ? '#1890ff' : undefined }}
			/>
		),
		onFilter: (value, record) => {
			console.log(record);
			console.log(dataIndex);

			return record[dataIndex]
				.toString()
				.toLowerCase()
				.includes(value.toLowerCase());
		},

		onFilterDropdownOpenChange: (visible) => {
			if (visible) {
				setTimeout(() => searchInput.current?.select(), 100);
			}
		},
		render: (text) =>
			searchedColumn === dataIndex ? (
				<Highlighter
					highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
					searchWords={[searchText]}
					autoEscape
					textToHighlight={text ? text.toString() : ''}
				/>
			) : (
				text
			),
	});

	const columns = [
		{
			title: 'Largura',
			dataIndex: 'oldSizeX',
			key: 'id',
			width: '12%',
			editable: true,
			sorter: (a, b) => a.oldSizeX - b.oldSizeX,
			sortDirections: ['descend', 'ascend'],
			...getColumnSearchProps('oldSizeX'),
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
			...getColumnSearchProps('oldSizeY'),
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
			setSizeSelected(selectedRows[0]);
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
