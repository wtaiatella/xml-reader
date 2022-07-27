import { useContext, useRef, useState } from 'react';
import Highlighter from 'react-highlight-words';

import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Space, Table } from 'antd';

import { UserContext } from '../../../contexts/UserContext';
import { Container } from './styles';

export function ReportXml() {
	const [searchText, setSearchText] = useState('');
	const [searchedColumn, setSearchedColumn] = useState('');
	const searchInput = useRef(null);

	const { xmlData } = useContext(UserContext);

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
	];

	return (
		<Container>
			<p>Relatório XML</p>
			<Table
				className='tableData'
				columns={columns}
				dataSource={data}
				pagination={{
					pageSize: 100,
				}}
			/>
		</Container>
	);
}
