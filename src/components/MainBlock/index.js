import { useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';
import { ReportXml } from './ReportXml';
import { Container } from './styles';
import { UpdateXml } from './UpdateXml';

export function MainBlock() {
	const { resumo } = useContext(UserContext);

	return (
		<Container>
			{resumo === false ? <UpdateXml /> : <ReportXml />}
		</Container>
	);
}
