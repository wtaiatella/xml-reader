import { database } from '../adapters/database';

const findXmlConfig = async () => {
	const xmlConfig = await database.XmlConfig.findMany({});

	return xmlConfig;
};

const createXmlConfig = async (req) => {
	const newXmlConfig = database.XmlConfig.create({
		data: {
			...req.body,
		},
	});
	return newXmlConfig;
};

const updateXmlConfig = async (postId, req) => {
	const xmlConfig = database.XmlConfig.update({
		where: {
			key: postId,
		},
		data: {
			...req.body,
		},
	});
	return xmlConfig;
};

const findSlug = async (fileSlug) => {
	const file = await database.XmlConfig.findUnique({
		where: {
			slug: fileSlug,
		},
	});

	return file;
};

const deleteXmlConfig = async (postId) => {
	const xml = await database.XmlConfig.delete({
		where: {
			key: postId,
		},
	});

	return xml;
};

const defaultFunctions = {
	findXmlConfig,
	createXmlConfig,
	updateXmlConfig,
	deleteXmlConfig,
	findSlug,
};

export default defaultFunctions;
