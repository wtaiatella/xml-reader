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
	const [searchedColumn, setSearchedColumn] = useState('');
	const searchInput = useRef(null);
	const [confirmLoading, setConfirmLoading] = useState(false);
	const [sizeSelected, setSizeSelected] = useState('');
	const [disabled, setDisabled] = useState(false);
	const [filterActive, setFilterActive] = useState(false);
	const [preFilterValue, setPreFilterValue] = useState({});
	const [form] = Form.useForm();
	const [editingKey, setEditingKey] = useState('');
	const [bounds, setBounds] = useState({
		left: 0,
		top: 0,
		bottom: 0,
		right: 0,
	});
	const draggleRef = useRef(null);

	useEffect(() => {
		//recebe os dados larg e altura e seta prefiltro
		if (open) {
			console.log('Abertura do Modal');
			console.log(selectedWorldmapsKeys);
			console.log(
				worldmapsTable.find(
					(worldmap) => worldmap.key == selectedWorldmapsKeys[0]
				)
			);

			setPreFilterValue(
				worldmapsTable.find(
					(worldmap) => worldmap.key == selectedWorldmapsKeys[0]
				)
			);
			setFilterActive(true);
		}
	}, [open, selectedWorldmapsKeys, worldmapsTable]);

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
				body: JSON.stringify({
					Width: parseInt(preFilterValue.Width),
					Height: parseInt(preFilterValue.Height),
					newSizeX: 0,
					newSizeY: 0,
					limitLeft: 0,
					limitRight: 0,
				}),
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

	const handleModalOk = async () => {
		setConfirmLoading(true);
		//TODO: Adicionar update da base dados

		console.log('Tela Modal button OK');
		console.log(sizeSelected);
		console.log(selectedWorldmapsKeys);

		const newWorldmapsTable = [...worldmapsTable];
		for (let selectedWorldmap of selectedWorldmapsKeys) {
			console.log('selectedWorldmap to update: ', selectedWorldmap);

			for (const worldmapTable of newWorldmapsTable) {
				if (worldmapTable.key == selectedWorldmap) {
					//TODO: fazer updade do worldmap
					console.log('worldmap antes do update');
					console.log(worldmapTable);
					const updateWorldmap = async () => {
						const response = await fetch(
							`api/worldmaps/${worldmapTable.key}`,
							{
								method: 'PUT',
								headers: {
									'Content-Type': 'application/json',
								},
								body: JSON.stringify({
									newSizeX: sizeSelected.newSizeX,
									newSizeY: sizeSelected.newSizeY,
									limitLeft: sizeSelected.limitLeft,
									limitRight: sizeSelected.limitRight,
									hasRightMenu: sizeSelected.hasRightMenu,
								}),
							}
						);
						const worldmapUpdated = await response.json();

						console.log('worldmap depois do fetch');
						console.log(worldmapUpdated);
						return worldmapUpdated;
					};
					const updatedWorldmap = await updateWorldmap();
					worldmapTable.newSizeX = updatedWorldmap.newSizeX;
					worldmapTable.newSizeY = updatedWorldmap.newSizeY;
					worldmapTable.limitLeft = updatedWorldmap.limitLeft;
					worldmapTable.limitRight = updatedWorldmap.limitRight;
					worldmapTable.hasRightMenu = updatedWorldmap.hasRightMenu;
				}
			}
		}
		console.log('Nova tabela worldmaps');
		console.log(newWorldmapsTable);

		setWorldmapsTable(newWorldmapsTable);
		console.log(`Worldmap atualizado`);
		setOpen(false);
		setConfirmLoading(false);
	};

	const handleModalCancel = () => {
		console.log('Clicked cancel button');
		setOpen(false);
		setDisabled(false);
		setEditingKey('');
		setPreFilterValue([]);
	};

	const handleSearch = (selectedKeys, confirm, dataIndex) => {
		console.log('Botão Buscar');
		console.log(selectedKeys[0]);
		confirm();
		//setSearchText(selectedKeys[0]);
		setSearchedColumn(dataIndex);
		setPreFilterValue({
			...preFilterValue,
			[dataIndex]: selectedKeys[0],
		});
	};

	const handleReset = async (clearFilters) => {
		clearFilters();
		//setSearchText('');
		setPreFilterValue([]);
	};

	const getColumnSearchProps = (dataIndex) => ({
		filterDropdown: ({
			setSelectedKeys,
			selectedKeys,
			confirm,
			clearFilters,
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
			console.log('Carregando o filtro');
			console.log(record);
			console.log(dataIndex);
			console.log(value);

			return record[dataIndex]
				.toString()
				.toLowerCase()
				.includes(value.toString().toLowerCase());
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
					searchWords={
						dataIndex == 'Width'
							? [preFilterValue?.Width]
							: [preFilterValue?.Height]
					}
					autoEscape
					textToHighlight={text ? text.toString() : ''}
				/>
			) : (
				text
			),
	});

	const columnsfuntion = () => {
		console.log('Chamada Columns');
		console.log(preFilterValue);
		return [
			{
				title: 'Width',
				dataIndex: 'Width',
				key: 'id',
				width: '12%',
				editable: true,
				sorter: (a, b) => a.Width - b.Width,
				sortDirections: ['descend', 'ascend'],
				...getColumnSearchProps('Width'),
				render: (_, { Width }) => <>{Width} px</>,
				filteredValue: preFilterValue?.Width
					? [preFilterValue?.Width]
					: [],
				filtered: filterActive,
			},
			{
				title: 'Height',
				dataIndex: 'Height',
				key: 'Height',
				width: '12%',
				editable: true,
				sorter: (a, b) => a.Height - b.Height,
				sortDirections: ['descend', 'ascend'],
				...getColumnSearchProps('Height'),
				render: (_, { Height }) => <>{Height} px</>,
				filteredValue: preFilterValue?.Height
					? [preFilterValue?.Height]
					: [],
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
				sorter: (a, b) => a.limitLeft - b.limitLeft,
				sortDirections: ['descend', 'ascend'],
				render: (_, { limitLeft }) => <>{limitLeft} px</>,
			},
			{
				title: 'Margem Dir',
				dataIndex: 'limitRight',
				key: 'limitRight',
				width: '13%',
				editable: true,
				sorter: (a, b) => a.limitRight - b.limitRight,
				sortDirections: ['descend', 'ascend'],
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
							<Popconfirm
								title='Sure to cancel?'
								onConfirm={cancel}
							>
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
	};
	const columns = columnsfuntion();

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
