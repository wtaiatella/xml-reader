import React, { useEffect, useState } from 'react';
//import XMLParser from 'react-xml-parser';

import './App.css';

const App = () => {
	const [xmlData, setXmlData] = useState({
		fileName: '',
		xml: null,
		Name: '',
		ZoomFactor: '0',
		Width: '0',
		PixelRatio: '0',
		MaxY: '0',
		MaxX: '0',
		Height: '0',
	});
	const [showForm, setShowForm] = useState(false);
	const [sizes, setSizes] = useState('');

	const handleSetXmlFile = async (event) => {
		console.log('Dentro do subscribe');
		console.log(event.target.files[0]);

		if (event.target.files[0]) {
			const reader = new FileReader();
			reader.readAsText(event.target.files[0]);
			reader.onloadend = async (evt) => {
				const readerData = evt.target.result;

				const parser = new DOMParser();
				const xml = parser.parseFromString(readerData, 'text/xml');

				//console.log(xmlWorldmap);
				console.log('XML resultant do parser');
				console.log(xml);
				console.log(xml.getElementsByTagName('Worldmap')[0]);
				const xmlWorldmap = xml.getElementsByTagName('Worldmap')[0];

				console.log(xmlWorldmap.getAttribute('Name'));
				setXmlData({
					fileName: event.target.files[0].name,
					xml: xml,
					Name: xmlWorldmap.getAttribute('Name'),
					ZoomFactor: xmlWorldmap.getAttribute('ZoomFactor'),
					Width: xmlWorldmap.getAttribute('Width'),
					PixelRatio: xmlWorldmap.getAttribute('PixelRatio'),
					MaxY: xmlWorldmap.getAttribute('MaxY'),
					MaxX: xmlWorldmap.getAttribute('MaxX'),
					Height: xmlWorldmap.getAttribute('Height'),
				});
			};
		}
	};

	useEffect(() => {
		if (xmlData.xml) {
			console.log('subscribe');
			console.log(xmlData.xml);
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

	const handleSubmit = async (event) => {
		event.preventDefault();

		console.log('função handlerSumit');
		console.log(sizes);

		const resXY = sizes.split('x');
		const largura = resXY[0];
		const altura = resXY[1];

		const xmlText = new XMLSerializer().serializeToString(
			xmlData.xml.documentElement
		);

		/*
		console.log(
			'XML do parser convertido para String, somente para console.log '
		);
		console.log(xmlText);
		*/

		const xmlWorldmap = xmlData.xml.getElementsByTagName('Worldmap')[0];
		xmlWorldmap.setAttribute('Width', largura);
		xmlWorldmap.setAttribute('MaxX', largura);

		xmlWorldmap.setAttribute('Height', altura);
		xmlWorldmap.setAttribute('MaxY', altura);
		console.log(xmlWorldmap);

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
		<div className='App'>
			<div className='App-body'>
				<img src='./logoSiemens.png' className='App-logo' alt='logo' />
				<h1>Escolha arquivo XML</h1>
				<input
					type='file'
					className='FileInput'
					onChange={handleSetXmlFile}
				/>
				{showForm ? (
					<>
						<p className='FileName'>
							<strong>Nome do arquivo : </strong>
							{xmlData.Name}
						</p>
						<div className='Container'>
							<section className='Info'>
								<p className='Titulo'>Atributos do WorldMap</p>
								<div className='Linha'></div>
								<p className='Dados'>
									<strong>ZoomFactor : </strong>
									{xmlData.ZoomFactor}
								</p>
								<p className='Dados'>
									<strong>PixelRatio : </strong>
									{xmlData.PixelRatio}
								</p>
								<div className='Linha'></div>
								<p className='Dados'>
									<strong>Width : </strong>
									{xmlData.Width} px
								</p>
								<p className='Dados'>
									<strong>Height : </strong>
									{xmlData.Height} px
								</p>
								<div className='Linha'></div>
								<p className='Dados'>
									<strong>MaxY : </strong>
									{xmlData.MaxY} px
								</p>
								<p className='Dados'>
									<strong>MaxX : </strong>
									{xmlData.MaxX} px
								</p>
								<div className='Linha'></div>
							</section>
							<form className='Form' onSubmit={handleSubmit}>
								<p className='Titulo'>Alteração de Atributos</p>
								<input
									type='text'
									list='Sizes'
									placeholder='Escolha uma Resolução'
									onChange={(event) =>
										setSizes(event.target.value)
									}
								/>
								<datalist id='Sizes'>
									<option>1500x900</option>
									<option>3200x1200</option>
								</datalist>
								<button type='submit' className='ButtonSubmit'>
									Carregar
								</button>
							</form>
						</div>
					</>
				) : (
					<span> </span>
				)}
			</div>
		</div>
	);
};

export default App;
