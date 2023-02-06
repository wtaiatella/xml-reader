const ConfigXmlData = (file, setXmlData, xmlData) => {
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
		const xmlWmGroup = xml
			.getElementsByTagName('WmGroup')[0]
			.getAttribute('Name');

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

		setXmlData({
			...xmlData,
			fileName: file.name,
			xml: xml,
			worldmaps: xmlWorldmaps,
			xmlWmGroup,
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
