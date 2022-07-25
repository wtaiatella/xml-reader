import { useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';
import { Container } from './styles';

import utils from './../../utils';

export function Header() {
	const { setXmlData } = useContext(UserContext);

	const handleUpload = async (event) => {
		console.log('Dentro do subscribe');
		console.log(event.target.files[0]);

		if (event.target.files[0]) {
			utils.ConfigXmlData(event.target.files[0], setXmlData);
		}
	};

	return (
		<Container>
			<img src='./logoSiemens.png' className='App-logo' alt='logo' />
			<h1>Escolha arquivo XML</h1>
			<input type='file' className='FileInput' onChange={handleUpload} />
		</Container>
	);
}
