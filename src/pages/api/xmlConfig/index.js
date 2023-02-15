import prisma from '../../../adapters/database';
import xmlService from '../../../services/xmlService';

export default async function handle(req, res) {
	if (req.method === 'GET') {
		const xml = await xmlService.findXmlConfig();
		res.json(xml);
	} else if (req.method === 'POST') {
		const xml = await xmlService.createXmlConfig(req);
		res.json(xml);
	} else {
		throw new Error(
			`The HTTP ${req.method} method is not supported at this route.`
		);
	}
}
