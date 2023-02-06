import React, { useContext, useState } from 'react';
import { UserContext } from '../../../contexts/UserContext';
import { Container } from './styles';
import { PlusOutlined } from '@ant-design/icons';
import {
	Modal,
	Divider,
	Input,
	message,
	Select,
	Space,
	Typography,
} from 'antd';
//import 'antd/dist/antd.css';

export function TableModal({ open, setOpen, selectedRowKeys }) {
	const { xmlData } = useContext(UserContext);
	const [newSize, setNewSize] = useState('');
	const [confirmLoading, setConfirmLoading] = useState(false);
	const [sizeSelected, setSizeSelected] = useState('');

	const onNewSizeChange = (event) => {
		setNewSize(event.target.value);
	};

	const { Option } = Select;
	const [sizeList, setSizeList] = useState(['1200x900', '3200x1800']);

	console.log('open = ', open);

	const onSelectSizeChange = (valor) => {
		console.log('Select change');
		console.log(valor);
		setSizeSelected(valor);
	};

	const addNewSize = (e) => {
		e.preventDefault();
		const sizeRegExp = new RegExp(`^[0-9]+[x][0-9]+$`);
		console.log(newSize);
		if (sizeRegExp.test(newSize)) {
			setSizeList([...sizeList, newSize]);
			setNewSize('');
		} else {
			message.error(
				'Valor inválido. Entre com um valor do tipo 0000x0000'
			);
		}
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

	return (
		<Container>
			<Modal
				title='Seleção do tamanho da tela'
				open={open}
				onOk={handleModalOk}
				onCancel={handleModalCancel}
				confirmLoading={confirmLoading}
			>
				<p>
					Selecione o novo tamanho de tela para os worldmaps marcados.
				</p>
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
									placeholder='Entre com novo tamanho'
									value={newSize}
									onChange={onNewSizeChange}
								/>
								<Typography.Link
									onClick={addNewSize}
									style={{ whiteSpace: 'nowrap' }}
								>
									<PlusOutlined /> Adicionar
								</Typography.Link>
							</Space>
						</>
					)}
				>
					{sizeList.map((item) => (
						<Option key={item}>{item}</Option>
					))}
				</Select>
			</Modal>
		</Container>
	);
}
