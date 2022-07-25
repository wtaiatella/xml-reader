import React, { useEffect, useState } from 'react';
import { useContext } from 'react';
import { Form } from '../Form';
import { Info } from '../Info';
import { UserContext } from '../../contexts/UserContext';
import {
	ArrowRightOutlined,
	ArrowLeftOutlined,
	DownloadOutlined,
} from '@ant-design/icons';
import { Button } from 'antd';

import { Container } from './styles';

export function Content() {
	const { xmlData, setXmlData } = useContext(UserContext);
	const [showForm, setShowForm] = useState(false);

	useEffect(() => {
		if (xmlData.xml) {
			console.log('subscribe');
			console.log(xmlData.xml);
			console.log(`Quantidade de Worldmaps = ${xmlData.quantidade}`);
			console.log(`Name = ${xmlData.Name}`);
			console.log(`ZoomFactor = ${xmlData.ZoomFactor}`);
			console.log(`Width = ${xmlData.Width}`);
			console.log(`PixelRatio = ${xmlData.PixelRatio}`);
			console.log(`MaxY = ${xmlData.MaxY}`);
			console.log(`MaxX = ${xmlData.MaxX}`);
			console.log(`Height = ${xmlData.Height}`);

			setShowForm(true);
		}
	}, [xmlData]);

	const handleBefore = () => {
		if (xmlData.posAtual > 0) {
			setXmlData({
				...xmlData,
				posAtual: xmlData.posAtual - 1,

				Name: xmlData.worldmaps[xmlData.posAtual - 1].getAttribute(
					'Name'
				),
				ZoomFactor:
					xmlData.worldmaps[xmlData.posAtual - 1].getAttribute(
						'ZoomFactor'
					),
				Width: xmlData.worldmaps[xmlData.posAtual - 1].getAttribute(
					'Width'
				),
				PixelRatio:
					xmlData.worldmaps[xmlData.posAtual - 1].getAttribute(
						'PixelRatio'
					),
				MaxY: xmlData.worldmaps[xmlData.posAtual - 1].getAttribute(
					'MaxY'
				),
				MaxX: xmlData.worldmaps[xmlData.posAtual - 1].getAttribute(
					'MaxX'
				),
				Height: xmlData.worldmaps[xmlData.posAtual - 1].getAttribute(
					'Height'
				),
			});
		}
	};

	const handleNext = () => {
		if (xmlData.posAtual < xmlData.quantidade - 1) {
			setXmlData({
				...xmlData,
				posAtual: xmlData.posAtual + 1,
				Name: xmlData.worldmaps[xmlData.posAtual + 1].getAttribute(
					'Name'
				),
				ZoomFactor:
					xmlData.worldmaps[xmlData.posAtual + 1].getAttribute(
						'ZoomFactor'
					),
				Width: xmlData.worldmaps[xmlData.posAtual + 1].getAttribute(
					'Width'
				),
				PixelRatio:
					xmlData.worldmaps[xmlData.posAtual + 1].getAttribute(
						'PixelRatio'
					),
				MaxY: xmlData.worldmaps[xmlData.posAtual + 1].getAttribute(
					'MaxY'
				),
				MaxX: xmlData.worldmaps[xmlData.posAtual + 1].getAttribute(
					'MaxX'
				),
				Height: xmlData.worldmaps[xmlData.posAtual + 1].getAttribute(
					'Height'
				),
			});
		}
	};

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
			{showForm ? (
				<>
					<div className='Worldmap'>
						<p>
							<strong>Posição do Worldmap: </strong>
							{xmlData.posAtual + 1} / {xmlData.quantidade}
						</p>
						<Button
							type='primary'
							icon={<ArrowLeftOutlined />}
							onClick={handleBefore}
						>
							Anterior
						</Button>
						<Button
							type='primary'
							icon={<ArrowRightOutlined />}
							onClick={handleNext}
						>
							Proximo
						</Button>
					</div>
					<p className='FileName'>
						<strong>Nome do Worldmap: </strong>
						{xmlData.Name}
					</p>
					<div className='Container'>
						<Info />
						<Form />
					</div>
					<Button
						type='primary'
						icon={<DownloadOutlined />}
						onClick={handleSave}
						className='ButtonSave'
					>
						Salvar
					</Button>
				</>
			) : (
				<span> </span>
			)}
		</Container>
	);
}
