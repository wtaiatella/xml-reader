import React from 'react';
// eslint-disable-next-line no-unused-vars
import XMLParser from 'react-xml-parser';
//import List from '../xml.xml';

import './App.css';

const App = () => {
	const handleSubmit = (ev) => {
		ev.preventDefault();
		//console.log(ev);
		console.log(ev.target[0].files[0]);

		const file = ev.target[0].files[0];
		const reader = new FileReader();

		reader.readAsText(file);
		reader.onloadend = (evt) => {
			const readerData = evt.target.result;

			console.log('Dados de entrada');
			console.log(readerData);

			const parser = new DOMParser();
			const xml = parser.parseFromString(readerData, 'text/xml');
			console.log(xml);

			//const pi1 = xml.createAttribute('version="1.0" encoding="UTF-8"');
			//const pi2 = xml.createAttributeNS('version="1.0" encoding="UTF-8"');
			//const pi2 = xml.createComment('version="1.0" encoding="UTF-8"');
			//const pi2 = xml.('version="1.0" encoding="UTF-8"');

			//xml.appendChild(pi1);

			const xmlWorldmap = xml.getElementsByTagName('Worldmap')[0];
			xmlWorldmap.setAttribute('Name', 'Novo nome123');

			console.log(xmlWorldmap);
			console.log('XML resultant do parser');
			console.log(xml);

			console.log(
				'XML do parser convertido para String, somente para console.log '
			);
			console.log(
				'<?xml version="1.0" encoding="UTF-8"?>\n' +
					new XMLSerializer().serializeToString(xml.documentElement)
			);

			var NewXml = new XMLParser().parseFromString(
				new XMLSerializer().serializeToString(xml.documentElement)
			); // Assume xmlText contains the example XML

			console.log(
				'newxml',
				NewXml.children[0].children[0].children[0].attributes
			);
			//NewXml.children[0].children[0].children[0].attributes.Name =
			//('teste de xml');

			//criação do documento xml
			//const doc = document.implementation.createDocument('', '', null);

			//Download do XML modificado
			var element = document.createElement('a');
			element.setAttribute(
				'href',
				'data:text/plain;charset=utf-8, ' +
					encodeURIComponent(
						new XMLSerializer().serializeToString(
							xml.documentElement
						)
					)
			);
			element.setAttribute('download', file.name);
			document.body.appendChild(element);
			element.click();
			//document.body.removeChild(element);
		};
	};

	return (
		<div className='App'>
			<header className='App-header'>
				<img src='./logoSiemens.png' className='App-logo' alt='logo' />
				<p>Escolha arquivo XML</p>
				<form onSubmit={handleSubmit}>
					<input type='file' />
					<button type='submit' className='ButtonSubmit'>
						Carregar
					</button>
				</form>
			</header>
		</div>
	);
};

export default App;
