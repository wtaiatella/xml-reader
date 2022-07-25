const ConfigXmlData = (file, setXmlData) => {
	const reader = new FileReader();
	reader.readAsText(file);
	reader.onloadend = async (evt) => {
		const readerData = evt.target.result;

		const parser = new DOMParser();
		const xml = parser.parseFromString(readerData, 'text/xml');

		//console.log(xmlWorldmap);
		console.log('XML resultant do parser');
		console.log(xml);
		console.log(xml.getElementsByTagName('Worldmap'));
		const xmlWorldmaps = xml.getElementsByTagName('Worldmap');
		//const qntWorldmaps = xmlWorldmaps.length();
		//console.log(`Quantidade de Worldmaps = ${qntWorldmaps}`);

		console.log(xmlWorldmaps.length);
		console.log(xmlWorldmaps[0].getAttribute('Name'));
		setXmlData({
			fileName: file.name,
			xml: xml,
			worldmaps: xmlWorldmaps,
			posAtual: 0,
			quantidade: xmlWorldmaps.length,
			Name: xmlWorldmaps[0].getAttribute('Name'),
			ZoomFactor: xmlWorldmaps[0].getAttribute('ZoomFactor'),
			Width: xmlWorldmaps[0].getAttribute('Width'),
			PixelRatio: xmlWorldmaps[0].getAttribute('PixelRatio'),
			MaxY: xmlWorldmaps[0].getAttribute('MaxY'),
			MaxX: xmlWorldmaps[0].getAttribute('MaxX'),
			Height: xmlWorldmaps[0].getAttribute('Height'),
		});
	};
};

const defaultFunctions = { ConfigXmlData };

export default defaultFunctions;
