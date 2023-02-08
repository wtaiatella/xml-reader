import prisma from '../../../adapters/database';
import xmlService from '../../../services/xmlService';

export default async function handle(req, res) {
	if (req.method === 'GET') {
		const xml = await xmlService.findXmlConfig();
		//const xml = await prisma.XmlConfig.findmany({});
		res.json(xml);
	} else if (req.method === 'POST') {
		const xml = await xmlService.createXmlConfig();
		//const xml = await prisma.XmlConfig.findmany({});
		res.json(xml);
	} else {
		throw new Error(
			`The HTTP ${req.method} method is not supported at this route.`
		);
	}
}

// GET /api/xmlconfig/
async function handleGET(res) {
	const xml = await prisma.XmlConfig.findmany();
	res.json(xml);
}

// GET /api/xmlconfig/
async function handleCreate(res) {
	const xml = await prisma.XmlConfig.create({
		data: {
			...req.body,
		},
	});
	res.json(xml);
}
