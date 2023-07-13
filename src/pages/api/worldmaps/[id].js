import worldmapService from '../../../services/worldmapService';

export default async function handle(req, res) {
	const postId = req.query.id;
	console.log('Id recebida');
	console.log(postId);
	if (req.method === 'PUT') {
		const worldmap = await worldmapService.updateWorldmap(postId, req);
		res.json(worldmap);
	} else {
		throw new Error(
			`The HTTP ${req.method} method is not supported at this route.`
		);
	}
}
