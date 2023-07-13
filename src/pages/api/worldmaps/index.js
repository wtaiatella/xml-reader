import worldmapService from '../../../services/worldmapService';

export default async function handle(req, res) {
	console.log('função api');
	if (req.method === 'GET') {
		const worldmaps = await worldmapService.allWorldmaps();
		res.json(worldmaps);
	} else if (req.method === 'PUT') {
		const worldmap = await worldmapService.validateWorldmap(req);
		res.json(worldmap);
	} else if (req.method === 'POST') {
		console.log('API POST');
		const worldmap = await worldmapService.createWorldmap(req);
		res.json(worldmap);
	} else {
		throw new Error(
			`The HTTP ${req.method} method is not supported at this route.`
		);
	}
}
