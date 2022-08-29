import { useContext, useEffect, useState } from 'react';

import { UserContext } from '../../contexts/UserContext';
import { Container } from './styles';
import utils from './utils';

export function XmlMap() {
	const [treeData, setTreeData] = useState([]);

	const { xmlData } = useContext(UserContext);
	const { xml } = xmlData;

	useEffect(() => {
		console.log(xml);
		if (xml != null) {
			const xmlTree = utils.printXML(
				xml.getElementsByTagName('Worldmap')
			);
			console.log(xmlTree);
			setTreeData(xmlTree);
		}
	}, [xml]);

	if (treeData.length > 0) console.log(treeData);

	return (
		<Container>
			<p>Carregado arvore</p>
		</Container>
	);
}
