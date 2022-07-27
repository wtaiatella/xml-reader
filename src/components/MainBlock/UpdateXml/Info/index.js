import { useContext } from 'react';
import { UserContext } from '../../../../contexts/UserContext';
import { Container } from './styles';

export function Info() {
	const { xmlData } = useContext(UserContext);

	return (
		<Container>
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
		</Container>
	);
}
