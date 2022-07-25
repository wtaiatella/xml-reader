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
		console.log(xml.getElementsByTagName('Worldmap')[0]);
		const xmlWorldmap = xml.getElementsByTagName('Worldmap')[0];

		console.log(xmlWorldmap.getAttribute('Name'));
		setXmlData({
			fileName: file.name,
			xml: xml,
			Name: xmlWorldmap.getAttribute('Name'),
			ZoomFactor: xmlWorldmap.getAttribute('ZoomFactor'),
			Width: xmlWorldmap.getAttribute('Width'),
			PixelRatio: xmlWorldmap.getAttribute('PixelRatio'),
			MaxY: xmlWorldmap.getAttribute('MaxY'),
			MaxX: xmlWorldmap.getAttribute('MaxX'),
			Height: xmlWorldmap.getAttribute('Height'),
		});
	};
};

const defaultFunctions = { ConfigXmlData };

export default defaultFunctions;
