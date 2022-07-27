import { useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';
import { Container } from './styles';

import utils from './../../utils';

export function Header() {
	const { xmlData, setXmlData, resumo, setResumo } = useContext(UserContext);

	const handleUpload = async (event) => {
		console.log('Dentro do subscribe');
		console.log(event.target.files[0]);

		if (event.target.files[0]) {
			utils.ConfigXmlData(event.target.files[0], setXmlData);
		}
	};

	const handleAtualizar = () => {
		if (resumo === true) setResumo(false);
	};

	const handleResumo = () => {
		if (resumo === false) setResumo(true);
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
				<button onClick={handleAtualizar}>Atualizar XML</button>
				<button onClick={handleResumo}>Ver Resumo</button>
			</div>
		</Container>
	);
}
