import { useContext, useRef, useState } from 'react';
import Highlighter from 'react-highlight-words';

import { SearchOutlined, DownloadOutlined } from '@ant-design/icons';
import {
	Form,
	Typography,
	Popconfirm,
	Button,
	Input,
	InputNumber,
	Space,
	Table,
	Tag,
	message,
} from 'antd';

import { UserContext } from '../../contexts/UserContext';
import { Container } from './styles';
import { TableModal } from './Modal';
import utils from '../../utils';

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

export function XmlTable() {
	const [searchText, setSearchText] = useState('');
	const [searchedColumn, setSearchedColumn] = useState('');
	const searchInput = useRef(null);
	const [selectedRowKeys, setSelectedRowKeys] = useState([]);
	const [openModal, setOpenModal] = useState(false);
	const [form] = Form.useForm();
	const [editingKey, setEditingKey] = useState('');
	const { xmlData, setXmlData, worldmapsTable, setWorldmapsTable } =
		useContext(UserContext);

	const isEditing = (record) => record.key === editingKey;

	console.log('Carregando dados');
	console.log(xmlData.worldmaps);

	const edit = (record) => {
		form.setFieldsValue({
			newSizeX: '',
			newSizeY: '',
			limitLeft: '',
			limitRight: '',
			hasRightMenu: '',
			...record,
		});
		setEditingKey(record.key);
	};

	const cancel = () => {
		setEditingKey('');
	};

	const save = async (key) => {
		console.log('Tela Modal button OK');
		console.log(key);

		try {
			const row = await form.validateFields();
			console.log('row = ', row);

			const newWorldmapsTable = [...worldmapsTable];

			const index = newWorldmapsTable.findIndex(
				(item) => key === item.key
			);
			if (index > -1) {
				let item = newWorldmapsTable[index];

				console.log('item antes splice= ', item);
				newWorldmapsTable.splice(index, 1, {
					...item,
					...row,
				});

				item = newWorldmapsTable[index];

				setWorldmapsTable(newWorldmapsTable);
				setEditingKey('');

				console.log('item antes do fetch');
				console.log(item);

				const updateWorldmap = async () => {
					const response = await fetch(`api/worldmaps/${item.key}`, {
						method: 'PUT',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({
							newSizeX: +item.newSizeX,
							newSizeY: +item.newSizeY,
							limitLeft: +item.limitLeft,
							limitRight: +item.limitRight,
							hasRightMenu: item.hasRightMenu,
						}),
					});
					const worldmapUpdated = await response.json();

					console.log('worldmap depois do fetch');
					console.log(worldmapUpdated);

					return worldmapUpdated;
				};
				await updateWorldmap();
			}
		} catch (errInfo) {
			console.log('Validate Failed:', errInfo);
		}
	};

	const onSelectChange = (newSelectedRowKeys) => {
		console.log('selectedRowKeys changed: ', newSelectedRowKeys);
		setSelectedRowKeys(newSelectedRowKeys);
	};

	const rowSelection = {
		selectedRowKeys,
		onChange: onSelectChange,
	};

	const hasSelected = selectedRowKeys.length > 0;

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
		}) => (
			<div style={{ padding: 8 }}>
				<Input
					ref={searchInput}
					placeholder={`Buscar ${dataIndex}`}
					value={selectedKeys[0]}
					allowClear
					onChange={(e) =>
						setSelectedKeys(e.target.value ? [e.target.value] : [])
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
							clearFilters && (await handleReset(clearFilters));
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
		),
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
			title: 'Nome da tela',
			dataIndex: 'Name',
			key: 'Name',
			width: '40%',
			fixed: 'left',
			...getColumnSearchProps('Name'),
		},

		{
			title: 'Width',
			dataIndex: 'Width',
			key: 'Width',
			width: '10%',
			sorter: (a, b) => a.Width - b.Width,
			sortDirections: ['descend', 'ascend'],
			render: (_, { Width }) => <>{Width} px</>,
			editable: true,
		},
		{
			title: 'Height',
			dataIndex: 'Height',
			key: 'Height',
			width: '10%',
			sorter: (a, b) => a.Height - b.Height,
			sortDirections: ['descend', 'ascend'],
			render: (_, { Height }) => <>{Height} px</>,
			editable: true,
		},
		{
			title: 'Nova Larg',
			dataIndex: 'newSizeX',
			key: 'newSizeX',
			width: '11%',
			sorter: (a, b) => a.newSizeX - b.newSizeX,
			sortDirections: ['descend', 'ascend'],
			render: (_, { newSizeX }) => <>{newSizeX} px</>,
			editable: true,
		},
		{
			title: 'Nova Alt',
			dataIndex: 'newSizeY',
			key: 'newSizeY',
			width: '11%',
			sorter: (a, b) => a.newSizeY - b.newSizeY,
			sortDirections: ['descend', 'ascend'],
			render: (_, { newSizeY }) => <>{newSizeY} px</>,
			editable: true,
		},
		{
			title: 'Margem Esq',
			dataIndex: 'limitLeft',
			key: 'limitLeft',
			width: '13%',
			sorter: (a, b) => a.limitLeft - b.limitLeft,
			sortDirections: ['descend', 'ascend'],
			render: (_, { limitLeft }) => <>{limitLeft} px</>,
			editable: true,
		},
		{
			title: 'Margem Dir',
			dataIndex: 'limitRight',
			key: 'limitRight',
			width: '13%',
			sorter: (a, b) => a.limitRight - b.limitRight,
			sortDirections: ['descend', 'ascend'],
			render: (_, { limitRight }) => <>{limitRight} px</>,
			editable: true,
		},
		{
			title: 'Margem Dir?',
			dataIndex: 'hasRightMenu',
			key: 'hasRightMenu',
			width: '12%',
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
					<Button
						title='Download de arquivo'
						type='primary'
						onClick={() => {
							setSelectedRowKeys([record.key]);
							edit(record);
						}}
					>
						Edit
					</Button>
				);
			},
		},
	];

	const handleSave = (allWorlmaps) => {
		let xmlToSave = '';
		console.log('handleSave');
		//console.log(xmlData.xml);
		if (allWorlmaps && xmlData.xml) {
			console.log('salva tudo');
			xmlToSave = utils.updateXmlWorldmaps(xmlData.xml, worldmapsTable);
		} else {
			console.log('save only edited');
			const selectedWorldmaps = worldmapsTable.filter((worldmap) =>
				selectedRowKeys.find((key) => key == worldmap.key)
			);
			console.log(selectedWorldmaps);

			xmlToSave = utils.updateXmlWorldmaps(
				xmlData.xml,
				selectedWorldmaps
			);
		}
		console.log('Xml to save');
		console.log(xmlToSave);

		if (xmlToSave) {
			const xmlText = new XMLSerializer().serializeToString(xmlToSave);

			//Download do XML modificado
			var element = document.createElement('a');
			element.setAttribute(
				'href',
				'data:text/plain;charset=utf-8,' +
					`<?xml version="1.0" encoding="UTF-8"?>\n` +
					encodeURIComponent(xmlText)
			);
			element.setAttribute('download', xmlData.fileName);
			console.log('element para download');
			console.log(element);
			document.body.appendChild(element);
			element.click();
		}
	};

	const mergedColumns = columns.map((col) => {
		if (!col.editable) {
			return col;
		}
		return {
			...col,
			onCell: (record) => ({
				record,
				inputType: col.dataIndex === 'age' ? 'number' : 'text',
				dataIndex: col.dataIndex,
				title: col.title,
				editing: isEditing(record),
			}),
		};
	});

	const saveAllWorldmaps = true;
	return (
		<Container>
			<div className='headerTable'>
				<p>Arquivo: {xmlData.fileName}</p>
				<p>Grupo de Worldmaps: {xmlData.worldgroupName}</p>
			</div>
			<div className='buttonsTable'>
				<div>
					<Button
						type='primary'
						icon={<DownloadOutlined />}
						onClick={() => handleSave(!saveAllWorldmaps)}
						className='buttonSave'
					>
						Salvar Selecionados
					</Button>
					<Button
						type='primary'
						icon={<DownloadOutlined />}
						onClick={() => handleSave(saveAllWorldmaps)}
						className='buttonSave'
					>
						Salvar
					</Button>
				</div>
			</div>
			<Form form={form} component={false}>
				<Table
					components={{
						body: {
							cell: EditableCell,
						},
					}}
					className='tableData'
					rowClassName='editable-row'
					rowSelection={rowSelection}
					columns={mergedColumns}
					dataSource={worldmapsTable}
					pagination={false}
					scroll={{ x: 1000 }}
				/>
			</Form>
			<TableModal
				open={openModal}
				setOpen={() => setOpenModal()}
				selectedWorldmapsKeys={selectedRowKeys}
			/>
		</Container>
	);
}
