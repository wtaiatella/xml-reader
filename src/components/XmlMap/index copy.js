import { Tree } from 'antd';
import { useContext, useEffect, useState } from 'react';

import { UserContext } from '../../contexts/UserContext';
import { Container } from './styles';
import utils from './utils';

export async function XmlMap() {
	const [expandedKeys, setExpandedKeys] = useState([]);
	const [checkedKeys, setCheckedKeys] = useState([]);
	const [selectedKeys, setSelectedKeys] = useState([]);
	const [autoExpandParent, setAutoExpandParent] = useState(true);
	const [treeData, setTreeData] = useState([]);

	const { xmlData } = useContext(UserContext);
	const { xml } = xmlData;

	useEffect(() => {
		try {
			const xmlTree = utils.printXML(
				xml.getElementsByTagName('Worldmap')
			);
			console.log(xmlTree);
			setTreeData(xmlTree);
		} catch (error) {
			console.log(error);
		}
	}, [xml]);

	const onExpand = (expandedKeysValue) => {
		console.log('onExpand', expandedKeysValue); // if not set autoExpandParent to false, if children expanded, parent can not collapse.
		// or, you can remove all expanded children keys.

		setExpandedKeys(expandedKeysValue);
		setAutoExpandParent(false);
	};

	const onCheck = (checkedKeysValue) => {
		console.log('onCheck', checkedKeysValue);
		setCheckedKeys(checkedKeysValue);
	};

	const onSelect = (selectedKeysValue, info) => {
		console.log('onSelect', info);
		setSelectedKeys(selectedKeysValue);
	};

	return (
		<Container>
			{treeData.length > 0 ? (
				<Tree
					checkable
					onExpand={onExpand}
					expandedKeys={expandedKeys}
					autoExpandParent={autoExpandParent}
					onCheck={onCheck}
					checkedKeys={checkedKeys}
					onSelect={onSelect}
					selectedKeys={selectedKeys}
					treeData={treeData}
				/>
			) : (
				<p>Carregando arvore</p>
			)}
		</Container>
	);
}
