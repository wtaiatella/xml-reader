import { useContext, useState } from 'react';
import { UserContext } from '../../contexts/UserContext';
import { Container } from './styles';

export function Form() {
	const { xmlData } = useContext(UserContext);
	const [sizes, setSizes] = useState('');

	const handleSubmit = async (event) => {
		event.preventDefault();

		console.log('função handlerSumit');
		console.log(sizes);

		const resXY = sizes.split('x');
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

		const xmlWorldmap = xmlData.xml.getElementsByTagName('Worldmap')[0];

		xmlWorldmap.setAttribute('Width', largura);
		xmlWorldmap.setAttribute('MaxX', largura);

		xmlWorldmap.setAttribute('Height', altura);
		xmlWorldmap.setAttribute('MaxY', altura);

		console.log(`Worlmap atualizado`);
		console.log(xmlWorldmap);

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
		<Container onSubmit={handleSubmit}>
			<p className='Titulo'>Alteração de Atributos</p>
			<input
				type='text'
				list='Sizes'
				placeholder='Escolha uma Resolução'
				onChange={async (event) => setSizes(event.target.value)}
			/>
			<datalist id='Sizes'>
				<option>1500x900</option>
				<option>3200x1200</option>
			</datalist>
			<button type='submit' className='ButtonSubmit'>
				Carregar
			</button>
		</Container>
	);
}
