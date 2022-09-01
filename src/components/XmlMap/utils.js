function printXML(xmlRef, xmlLevel = 1) {
	console.log(xmlRef.length);
	console.log(xmlRef);
	let arrXml = [];

	for (let xmlItem of xmlRef) {
		console.log(`analise do xmlItem: ${xmlItem.tagName}`);
		console.log(`Array em formação: `);
		console.log(arrXml);
		let buscaItem = [];
		if (arrXml.length > 0) {
			buscaItem = arrXml.filter((item) => {
				return item.title === xmlItem.tagName;
			});
		}

		if (buscaItem.length === 0) {
			console.log(`ainda não existe no Array`);
			if (xmlItem.childElementCount > 0) {
				console.log('Com Children, Nova referencia do xml');
				console.log(xmlItem.children);
				const children = printXML(xmlItem.children);
				console.log(children);

				arrXml = [
					...arrXml,
					{
						title: xmlItem.tagName,
						key: xmlItem.tagName,
						children: children,
					},
				];
			} else {
				console.log('Sem Children, vai para próximo xmlItem');
				arrXml = [
					...arrXml,
					{
						title: xmlItem.tagName,
						key: xmlItem.tagName,
					},
				];
			}
		}
	}

	return arrXml;
}

const defaultFunctions = { printXML };

export default defaultFunctions;
