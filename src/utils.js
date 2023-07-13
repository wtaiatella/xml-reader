const ConfigXmlData = (file, xmlData, setXmlData, setWorldmapsTable) => {
	const reader = new FileReader();
	reader.readAsText(file);
	reader.onloadend = async (evt) => {
		const readerData = evt.target.result;

		const parser = new DOMParser();
		const xml = parser.parseFromString(readerData, 'text/xml');

		const xmlWorldmaps = xml.getElementsByTagName('Worldmap');
		const quantWorldmaps = xmlWorldmaps.length;

		const xmlWorldgroup = xml.getElementsByTagName('WmGroup');
		const worldgroupName = xmlWorldgroup[0].getAttribute('Name');
		const quantWorldGroups = xmlWorldgroup.length;

		//console.log(xmlWorldmap);
		console.log('XML resultant do parser');
		console.log(xml);
		console.log(xml.getElementsByTagName('Worldmap'));

		let listGoViews = [];
		for (let worldmap of xmlWorldmaps) {
			const xmlGoViews = worldmap.getElementsByTagName('GoView');
			listGoViews = [
				...listGoViews,
				{
					Name: worldmap.getAttribute('Name'),
					goview: [],
				},
			];
			for (let goview of xmlGoViews) {
				listGoViews = listGoViews.map((item) => {
					if (item.Name === worldmap.getAttribute('Name')) {
						return {
							Name: worldmap.getAttribute('Name'),
							goview: [
								...item.goview,
								{
									Name: goview.getAttribute('Name'),
									Width: goview.getAttribute('Width'),
									Height: goview.getAttribute('Height'),
									Top: goview.getAttribute('Top'),
									Left: goview.getAttribute('Left'),
									Visible: goview.getAttribute('Visible'),
								},
							],
						};
					} else {
						return item;
					}
				});
			}
		}
		console.log('lista de GoViews');
		console.log(listGoViews);

		console.log('Quantidade de Worlmaps');
		console.log(xmlWorldmaps.length);
		let worldmaps = [];
		for (let item of xmlWorldmaps) {
			//TODO: chamar API para buscar worldmap na base
			//TODO: Se não tiver insere dados

			const submitData = async () => {
				const response = await fetch('/api/worldmaps/', {
					method: 'PUT',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						group: worldgroupName,
						Name: item.getAttribute('Name'),
						Width: parseInt(item.getAttribute('Width')),
						Height: parseInt(item.getAttribute('Height')),
					}),
				});
				const respWorldmap = await response.json();
				console.log('dados retornados');
				console.log(respWorldmap);

				worldmaps = [
					...worldmaps,
					{
						key: respWorldmap.key,
						Name: respWorldmap.Name,
						Width: respWorldmap.Width,
						Height: respWorldmap.Height,
						newSizeX: respWorldmap.newSizeX,
						newSizeY: respWorldmap.newSizeY,
						limitLeft: respWorldmap.limitLeft,
						limitRight: respWorldmap.limitRight,
						hasRightMenu: respWorldmap.hasRightMenu,
					},
				];
				//TODO: Se tiver, carraga valor em worldmapsTable
				setWorldmapsTable(worldmaps);
			};
			submitData();
		}

		setXmlData({
			...xmlData,
			fileName: file.name,
			xml: xml,
			worldmaps: xmlWorldmaps,
			worldgroupName,
			quantWorldmaps,
			quantWorldGroups,
		});
	};
};

const updateXmlWorldmaps = (xml, worldmapsTable) => {
	console.log('Atualiza Xml Worldmaps antes de salvar');

	if (xml) {
		var xmlCopy = xml.importNode(xml.documentElement, true).cloneNode(true);
		let xmlWorldmap = xmlCopy.getElementsByTagName('Worldmap');
		console.log('Limpa wordmaps');
		let sizeXmlWorlmap = xmlWorldmap.length;
		const sizeWorldmapsTable = worldmapsTable.length;
		console.log('Quantidade de worldmaps na tabela: ' + sizeWorldmapsTable);

		while (sizeXmlWorlmap > sizeWorldmapsTable) {
			console.log('Quantidade de worldmaps no xml: ' + sizeXmlWorlmap);

			for (let worldmap of xmlWorldmap) {
				const editedWorldmap = worldmapsTable.find(
					(key) => key.Name == worldmap.getAttribute('Name')
				);
				if (!editedWorldmap) {
					console.log('Remove worldmap');
					console.log(worldmap.getAttribute('Name'));
					let removido = worldmap.parentNode.removeChild(worldmap);
					console.log(removido);
				}
			}
			sizeXmlWorlmap = xmlWorldmap.length;
		}

		for (let worldmap of xmlWorldmap) {
			const editedWorldmap = worldmapsTable.filter((key) => {
				console.log('Find tabela');
				console.log(key.Name);
				console.log(worldmap.getAttribute('Name'));
				return key.Name == worldmap.getAttribute('Name');
			})[0];
			console.log('tabela encontrada');
			console.log(editedWorldmap);

			const Width = +worldmap.getAttribute('Width');

			worldmap.setAttribute('Width', editedWorldmap.newSizeX);
			worldmap.setAttribute('MaxX', editedWorldmap.newSizeX);
			worldmap.setAttribute('Height', editedWorldmap.newSizeY);
			worldmap.setAttribute('MaxY', editedWorldmap.newSizeY);

			for (let child of worldmap.children) {
				const name = child.tagName;

				//console.log('Nome do Nó = ', name);
				if (name == 'GoView') {
					child.setAttribute('Width', editedWorldmap.newSizeX);
					child.setAttribute('Height', editedWorldmap.newSizeY);
					child.setAttribute('Top', 0);
					child.setAttribute('Left', 0);
				} else {
					console.log(child);
					const posX = +child.getAttribute('Left');

					let newX = 0;
					console.log('Nova posição de x');
					console.log('X antigo = ' + posX);
					if (
						posX >= editedWorldmap.limitRight &&
						editedWorldmap.hasRightMenu
					) {
						newX = posX + editedWorldmap.newSizeX - Width;
						console.log('X novo = ' + newX);

						child.setAttribute('left', newX);
						child.setAttribute('ReferenceRotationLeft', newX);
					} else if (posX >= editedWorldmap.limitLeft) {
						newX = posX + (editedWorldmap.newSizeX - Width) / 2;
						console.log('X novo = ' + newX);

						child.setAttribute('left', newX);
						child.setAttribute('ReferenceRotationLeft', newX);
					}
				}
			}
		}
	}
	return xmlCopy;
};

const defaultFunctions = { ConfigXmlData, updateXmlWorldmaps };

export default defaultFunctions;
