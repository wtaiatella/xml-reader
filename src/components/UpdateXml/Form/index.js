import React, { useContext, useState } from 'react';
import { UserContext } from '../../../contexts/UserContext';
import { Container } from './styles';
import { RedoOutlined, PlusOutlined } from '@ant-design/icons';
import { Divider, Input, message, Select, Space, Typography } from 'antd';
import 'antd/dist/antd.css';

const { Option } = Select;

export function Form() {
	const { xmlData, setXmlData } = useContext(UserContext);
	const [size, setSize] = useState('');
	const [newSize, setNewSize] = useState('');

	const [items, setItems] = useState(['1200x900', '3200x1800']);

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

	const handleSubmit = async (event) => {
		event.preventDefault();

		console.log('função handleSumit');
		console.log(size);

		const resXY = size.split('x');
		const largura = resXY[0];
		const altura = resXY[1];

		/*
		console.log(
			'XML do parser convertido para String, somente para console.log '
		);
		console.log(new XMLSerializer().serializeToString(
			xmlData.xml.documentElement
		));
		*/
		const posAtual = xmlData.posAtual;
		//const xmlWorldmap = xmlData.worldmaps[posAtual];
		const xmlWorldmap =
			xmlData.xml.getElementsByTagName('Worldmap')[posAtual];

		xmlWorldmap.setAttribute('Width', largura);
		xmlWorldmap.setAttribute('MaxX', largura);

		xmlWorldmap.setAttribute('Height', altura);
		xmlWorldmap.setAttribute('MaxY', altura);

		console.log(`Worlmap atualizado`);
		console.log(xmlWorldmap);

		setXmlData({
			...xmlData,

			Name: xmlWorldmap.getAttribute('Name'),
			ZoomFactor: xmlWorldmap.getAttribute('ZoomFactor'),
			Width: xmlWorldmap.getAttribute('Width'),
			PixelRatio: xmlWorldmap.getAttribute('PixelRatio'),
			MaxY: xmlWorldmap.getAttribute('MaxY'),
			MaxX: xmlWorldmap.getAttribute('MaxX'),
			Height: xmlWorldmap.getAttribute('Height'),
		});
	};

	return (
		<Container onSubmit={handleSubmit}>
			<p className='Titulo'>Alteração de Atributos</p>

			<Select
				style={{ width: 300 }}
				allowClear
				placeholder='Selecione as dimensões'
				onSelect={onSelectSizeChange}
				dropdownRender={(menu) => (
					<>
						{menu}
						<Divider style={{ margin: '8px 0' }} />
						<Space align='center' style={{ padding: '0 8px 4px' }}>
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
			<button
				type='submit'
				className='ButtonSubmit'
				icon={<RedoOutlined />}
			>
				Atualizar
			</button>
		</Container>
	);
}
