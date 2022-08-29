import { useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';
import { Container } from './styles';

import utils from './../../utils';
import { Link } from 'react-router-dom';

export function Header() {
	const { xmlData, setXmlData } = useContext(UserContext);

	const handleUpload = async (event) => {
		console.log('Dentro do subscribe');
		console.log(event.target.files[0]);

		if (event.target.files[0]) {
			utils.ConfigXmlData(event.target.files[0], setXmlData);
		}
	};

	return (
		<Container>
			<a href='/'>
				<img src='./logoSiemens.png' className='App-logo' alt='logo' />
			</a>

			<div className='fileInput'>
				<label className='FileButton' htmlFor='getFile'>
					Escolha arquivo XML
				</label>
				<label className='FileName' htmlFor='getFile'>
					{xmlData.fileName}
				</label>
				<input id='getFile' type='file' onChange={handleUpload} />
			</div>

			<div className='Menu'>
				<Link to='/'>Atualizar XML</Link>
				<Link to='/tabela'>Ver Tabela</Link>
				<Link to='/mapa'>Ver Mapa</Link>
			</div>
		</Container>
	);
}
