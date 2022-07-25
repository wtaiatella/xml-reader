import React, { useEffect, useState } from 'react';
import { useContext } from 'react';
import { Form } from '../Form';
import { Info } from '../Info';
import { UserContext } from '../../contexts/UserContext';

import { Container } from './styles';

export function Content() {
	const { xmlData } = useContext(UserContext);
	const [showForm, setShowForm] = useState(false);

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

	return (
		<Container>
			{showForm ? (
				<>
					<p className='FileName'>
						<strong>Nome do Worldmap: </strong>
						{xmlData.Name}
					</p>
					<div className='Container'>
						<Info />
						<Form />
					</div>
				</>
			) : (
				<span> </span>
			)}
		</Container>
	);
}
