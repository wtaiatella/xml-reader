import xmlService from '../../../services/xmlService';

export default async function handle(req, res) {
	const postId = req.query.id;

	if (req.method === 'DELETE') {
		const xml = await xmlService.deleteXmlConfig(postId);

		res.json(xml);
	} else if (req.method === 'PUT') {
		const xml = await xmlService.updateXmlConfig(postId, req);
		res.json(xml);
	} else {
		throw new Error(
			`The HTTP ${req.method} method is not supported at this route.`
		);
	}
}
