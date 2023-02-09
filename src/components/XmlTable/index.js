import { useContext, useRef, useState, useEffect } from 'react';
import Highlighter from 'react-highlight-words';

import { SearchOutlined, DownloadOutlined } from '@ant-design/icons';
import { Button, Input, Space, Table } from 'antd';

import { UserContext } from '../../contexts/UserContext';
import { Container } from './styles';
import { TableModal } from './Modal';

export function XmlTable() {
	const [searchText, setSearchText] = useState('');
	const [searchedColumn, setSearchedColumn] = useState('');
	const searchInput = useRef(null);
	const [selectedRowKeys, setSelectedRowKeys] = useState([]);
	const [openModal, setOpenModal] = useState(false);
	const [showTable, setShowTable] = useState(false);

	const { xmlData } = useContext(UserContext);

	useEffect(() => {
		if (xmlData.xml) {
			setShowTable(true);
		} else {
			setShowTable(false);
		}
	}, [xmlData]);

	const onSelectChange = (newSelectedRowKeys) => {
		console.log('selectedRowKeys changed: ', newSelectedRowKeys);
		setSelectedRowKeys(newSelectedRowKeys);
	};

	const rowSelection = {
		selectedRowKeys,
		onChange: onSelectChange,
	};
	const hasSelected = selectedRowKeys.length > 0;

	console.log('Carregando dados');
	console.log(xmlData.worldmaps);
	console.log(xmlData.xmlConfig);

	let data = [];

	if (xmlData.xml) {
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
	}

	const handleEdit = (keys) => {
		console.log(keys);
		setOpenModal(true);
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
			width: '25%',
			fixed: 'left',
			...getColumnSearchProps('Name'),
		},

		{
			title: 'ZoomFactor',
			dataIndex: 'ZoomFactor',
			key: 'ZoomFactor',
			width: '12%',
		},

		{
			title: 'Width',
			dataIndex: 'Width',
			key: 'Width',
			width: '12%',
			sorter: (a, b) => a.Width - b.Width,
			sortDirections: ['descend', 'ascend'],
			render: (_, { Width }) => <>{Width} px</>,
		},
		{
			title: 'Height',
			dataIndex: 'Height',
			key: 'Height',
			width: '12%',
			sorter: (a, b) => a.Height - b.Height,
			sortDirections: ['descend', 'ascend'],
			render: (_, { Height }) => <>{Height} px</>,
		},
		{
			title: 'MaxX',
			dataIndex: 'MaxX',
			key: 'MaxX',
			width: '12%',
			sorter: (a, b) => a.MaxX - b.MaxX,
			sortDirections: ['descend', 'ascend'],
			render: (_, { MaxX }) => <>{MaxX} px</>,
		},
		{
			title: 'MaxY',
			dataIndex: 'MaxY',
			key: 'MaxY',
			width: '12%',
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
			{showTable ? (
				<>
					<div className='headerTable'>
						<p>Arquivo: {xmlData.fileName}</p>
						<p>Grupo de Worldmaps: {xmlData.xmlWmGroup}</p>
					</div>
					<div className='buttonsTable'>
						<div className='buttonEdit'>
							<Button
								type='primary'
								onClick={() => handleEdit(selectedRowKeys)}
								disabled={!hasSelected}
							>
								Editar Seleção
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
							className='buttonSave'
						>
							Salvar
						</Button>
					</div>
					<Table
						className='tableData'
						rowSelection={rowSelection}
						columns={columns}
						dataSource={data}
						pagination={false}
						scroll={{ x: 1000 }}
					/>

					<TableModal
						open={openModal}
						setOpen={() => setOpenModal()}
						selectedRowKeys={selectedRowKeys}
					/>
				</>
			) : (
				<span> </span>
			)}
		</Container>
	);
}
