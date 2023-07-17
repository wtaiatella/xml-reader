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
		const worldgroupName =
			xmlWorldgroup.length > 0
				? xmlWorldgroup[0].getAttribute('Name')
				: null;
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

			const oldWidth = +worldmap.getAttribute('Width');
			const oldHeight = +worldmap.getAttribute('Height');

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
					const childName = child.getAttribute('Name');
					console.log(childName);

					if (childName == 'btnUnifilarGeral') {
						const btnUnifilar =
							child.getElementsByTagName('Chunk')[0];
						console.log(
							'botão antes = ' +
								btnUnifilar.childNodes[0].nodeValue
						);
						const textNode = btnUnifilar.childNodes[0];
						const newBtnValue = `
							AfCRB8ADAAdHUkZFRE9NCgAAAAD//v8AAP/+/wAFT0NYUEECAAAAAAAFT0NY
							Q0laAQAABAAAAAABAAAEAAAAKFTCBQAAAQAAACR5ek2NhdQRvzoAYAhbeYIA
							AAAAAA4AAMUXAACeAwAACwAAAAgAHgAAAFUATgBJAEYASQBMAEEAUgAgAEcA
							RQBSAEEATAAAAAsA//8TAA8AAIADAAAAAAAJAANS4wuRj84RneMAqgBLuFEB
							AAAAvALcfAEABUFyaWFsEwAIAAAACwD//wgAAgAAAAAACAACAAAAAAAIAE4A
							AAB7AEQAMwAyAEMAOABGADAAQgAtADMAQQBGADkALQA0AEQARQAwAC0AQQA4
							AEEANwAtADkAMABCADAARQA4ADcANgBFADQAOABFAH0AAAAIAAIAAAAAAAgA
							AgAAAAAACwD//wgAAgAAAAAACAACAAAAAAAIAAIAAAAAAAgAAgAAAAAACAAC
							AAAAAAAIAAIAAAAAAAMAAAAAAAgAAgAAAAAABQAAAAAAAAAAAA==
							
							`;
						textNode.nodeValue = newBtnValue;
						console.log(
							'botão depois = ' +
								btnUnifilar.childNodes[0].nodeValue
						);
					}

					const posX = +child.getAttribute('Left');
					const posY = +child.getAttribute('Top');

					let newX = 0;
					let newY = 0;
					console.log('Nova posição de x e y');
					console.log('X antigo = ' + posX);
					console.log('Y antigo = ' + posY);
					if (
						posX >= editedWorldmap.limitRight &&
						editedWorldmap.hasRightMenu
					) {
						newX = posX + editedWorldmap.newSizeX - oldWidth;
						console.log('X novo = ' + newX);
						console.log('Y novo = ' + posY);
						child.setAttribute('left', newX);
						child.setAttribute('ReferenceRotationLeft', newX);
					} else if (posX >= editedWorldmap.limitLeft) {
						newX =
							posX +
							Math.round(
								(editedWorldmap.newSizeX - oldWidth) / 2
							);
						newY =
							posY +
							Math.round(
								(editedWorldmap.newSizeY - oldHeight) / 2
							);
						console.log('X novo = ' + newX);
						console.log('Y novo = ' + newY);

						child.setAttribute('Left', newX);
						child.setAttribute('ReferenceRotationLeft', newX);
						child.setAttribute('Top', newY);
						child.setAttribute('ReferenceRotationTop', newY);
					} else {
						console.log('X novo = ' + posX);
						console.log('Y novo = ' + posY);
					}
				}
			}
		}
	}
	return xmlCopy;
};

const defaultFunctions = { ConfigXmlData, updateXmlWorldmaps };

export default defaultFunctions;
