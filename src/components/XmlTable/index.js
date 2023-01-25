import { useContext, useRef, useState } from 'react';
import Highlighter from 'react-highlight-words';

import {
	SearchOutlined,
	PlusOutlined,
	DownloadOutlined,
} from '@ant-design/icons';
import {
	Button,
	Input,
	Space,
	Table,
	Modal,
	Select,
	Divider,
	Typography,
	message,
} from 'antd';

import { UserContext } from '../../contexts/UserContext';
import { Container } from './styles';

export function XmlTable() {
	const [searchText, setSearchText] = useState('');
	const [searchedColumn, setSearchedColumn] = useState('');
	const searchInput = useRef(null);
	const [selectedRowKeys, setSelectedRowKeys] = useState([]);
	const [open, setOpen] = useState(false);
	const [confirmLoading, setConfirmLoading] = useState(false);
	const [size, setSize] = useState('');
	const [newSize, setNewSize] = useState('');
	const [items, setItems] = useState(['1200x900', '3200x1800']);

	const { Option } = Select;
	const { xmlData } = useContext(UserContext);

	const onNewSizeChange = (event) => {
		setNewSize(event.target.value);
	};

	const onSelectSizeChange = (valor) => {
		console.log('Select change');
		console.log(valor);
		setSize(valor);
	};

	const addItem = (e) => {
		e.preventDefault();
		const re = new RegExp(`^[0-9]+[x][0-9]+$`);
		console.log(newSize);
		if (re.test(newSize)) {
			setItems([...items, newSize]);
			setNewSize('');
		} else {
			message.error(
				'Valor inválido. Entre com um valor do tipo 0000x0000'
			);
		}
	};

	const showModal = () => {
		setOpen(true);
	};

	const handleModalOk = () => {
		setConfirmLoading(true);

		const xmlWorldmap = xmlData.xml.getElementsByTagName('Worldmap');
		console.log('Modal OK');
		console.log(size);
		console.log(xmlWorldmap);
		console.log(selectedRowKeys);

		const resXY = size.split('x');
		const largura = resXY[0];
		const altura = resXY[1];

		for (let selectedWorldmap of selectedRowKeys) {
			for (let worldmap of xmlWorldmap) {
				console.log('selectedWorldmap: ', selectedWorldmap);
				console.log(
					'worldmap.getAttribute(Name): ',
					worldmap.getAttribute('Name')
				);

				if (selectedWorldmap === worldmap.getAttribute('Name')) {
					worldmap.setAttribute('Width', largura);
					worldmap.setAttribute('MaxX', largura);
					worldmap.setAttribute('Height', altura);
					worldmap.setAttribute('MaxY', altura);

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

	const onSelectChange = (newSelectedRowKeys) => {
		console.log('selectedRowKeys changed: ', newSelectedRowKeys);
		setSelectedRowKeys(newSelectedRowKeys);
	};

	const rowSelection = {
		selectedRowKeys,
		onChange: onSelectChange,
	};
	const hasSelected = selectedRowKeys.length > 0;

	console.log(xmlData.worldmaps);

	let data = [];

	for (let item of xmlData.worldmaps) {
		data = [
			...data,
			{
				key: item.getAttribute('Name'),
				Name: item.getAttribute('Name'),
				ZoomFactor: item.getAttribute('ZoomFactor'),
				Width: item.getAttribute('Width'),
				PixelRatio: item.getAttribute('PixelRatio'),
				MaxY: item.getAttribute('MaxY'),
				MaxX: item.getAttribute('MaxX'),
				Height: item.getAttribute('Height'),
			},
		];
	}

	const handleEdit = (keys) => {
		//const editData = data.filter((item) => item.key === key);
		console.log(keys);
		showModal();
	};

	console.log(data);

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

		onFilterDropdownVisibleChange: (visible) => {
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
			width: '15%',
			fixed: 'left',
			...getColumnSearchProps('Name'),
		},

		{
			title: 'ZoomFactor',
			dataIndex: 'ZoomFactor',
			key: 'ZoomFactor',
			width: '15%',
		},

		{
			title: 'Width',
			dataIndex: 'Width',
			key: 'Width',
			width: '15%',
			sorter: (a, b) => a.Width - b.Width,
			sortDirections: ['descend', 'ascend'],
			render: (_, { Width }) => <>{Width} px</>,
		},
		{
			title: 'Height',
			dataIndex: 'Height',
			key: 'Height',
			width: '15%',
			sorter: (a, b) => a.Height - b.Height,
			sortDirections: ['descend', 'ascend'],
			render: (_, { Height }) => <>{Height} px</>,
		},
		{
			title: 'MaxX',
			dataIndex: 'MaxX',
			key: 'MaxX',
			width: '15%',
			sorter: (a, b) => a.MaxX - b.MaxX,
			sortDirections: ['descend', 'ascend'],
			render: (_, { MaxX }) => <>{MaxX} px</>,
		},
		{
			title: 'MaxY',
			dataIndex: 'MaxY',
			key: 'MaxY',
			width: '15%',
			sorter: (a, b) => a.MaxY - b.MaxY,
			sortDirections: ['descend', 'ascend'],
			render: (_, { MaxY }) => <>{MaxY} px</>,
		},
		{
			title: 'Action',
			key: 'operation',
			fixed: 'right',
			width: 100,
			render: (_, record) => {
				return (
					<Button
						title='Download de arquivo'
						type='primary'
						onClick={() => handleEdit([record.key])}
					>
						Edit
					</Button>
				);
			},
		},
	];

	const handleSave = () => {
		const xmlText = new XMLSerializer().serializeToString(
			xmlData.xml.documentElement
		);

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
	};

	return (
		<Container>
			<div>
				<Button
					type='primary'
					onClick={() => handleEdit(selectedRowKeys)}
					disabled={!hasSelected}
				>
					Reload
				</Button>
				<span
					style={{
						marginLeft: 8,
					}}
				>
					{hasSelected
						? `Selected ${selectedRowKeys.length} items`
						: ''}
				</span>
			</div>
			<Button
				type='primary'
				icon={<DownloadOutlined />}
				onClick={handleSave}
				className='ButtonSave'
			>
				Salvar
			</Button>
			<div>
				<Table
					className='tableData'
					rowSelection={rowSelection}
					columns={columns}
					dataSource={data}
					pagination={false}
					scroll={{ x: 1000 }}
				/>
			</div>
			<Modal
				title='Title'
				open={open}
				onOk={handleModalOk}
				onCancel={handleModalCancel}
				confirmLoading={confirmLoading}
			>
				<p>Texto adicional do Modal</p>
				<Select
					style={{ width: 300 }}
					allowClear
					placeholder='Selecione as dimensões'
					onSelect={onSelectSizeChange}
					dropdownRender={(menu) => (
						<>
							{menu}
							<Divider style={{ margin: '8px 0' }} />
							<Space
								align='center'
								style={{ padding: '0 8px 4px' }}
							>
								<Input
									placeholder='Please enter item'
									value={newSize}
									onChange={onNewSizeChange}
								/>
								<Typography.Link
									onClick={addItem}
									style={{ whiteSpace: 'nowrap' }}
								>
									<PlusOutlined /> Add item
								</Typography.Link>
							</Space>
						</>
					)}
				>
					{items.map((item) => (
						<Option key={item}>{item}</Option>
					))}
				</Select>
			</Modal>
		</Container>
	);
}
