import worldmapService from '../../../services/worldmapService';

export default async function handle(req, res) {
	console.log('função api');
	if (req.method === 'GET') {
		console.log('API GET');
		const worldmaps = await worldmapService.allWorldmaps();
		res.json(worldmaps);
	} else if (req.method === 'PUT') {
		console.log('API PUT');
		console.log(req.body);
		const worldmap = await worldmapService.validateWorldmap(req);
		console.log('API PUT - retorno');
		console.log(worldmap);
		res.json(worldmap);
	} else if (req.method === 'POST') {
		console.log('API POST');
		console.log('API POST');
		const worldmap = await worldmapService.createWorldmap(req);
		res.json(worldmap);
	} else {
		throw new Error(
			console.log(
				'API ERROR'
			)`The HTTP ${req.method} method is not supported at this route.`
		);
	}
}
