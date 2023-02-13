const ConfigXmlData = (file, setXmlData, xmlData) => {
	const reader = new FileReader();
	reader.readAsText(file);
	reader.onloadend = async (evt) => {
		const readerData = evt.target.result;

		const parser = new DOMParser();
		const xml = parser.parseFromString(readerData, 'text/xml');

		const xmlWorldmaps = xml.getElementsByTagName('Worldmap');
		const quantWorldmaps = xmlWorldmaps.length;

		const xlsWorldgroup = xml.getElementsByTagName('WmGroup');
		const worldgroupName = xlsWorldgroup[0].getAttribute('Name');
		const quantWorldGroups = xlsWorldgroup.length;

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

const defaultFunctions = { ConfigXmlData };

export default defaultFunctions;
