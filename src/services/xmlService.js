import { database } from '../adapters/database';

const findXmlConfig = async () => {
	const xmlConfig = await database.XmlConfig.findMany({});

	return xmlConfig;
};

const createXmlConfig = async () => {
	const newXmlConfig = database.XmlConfig.create({
		data: {
			oldSizeX: 0,
			oldSizeY: 0,
			newSizeX: 0,
			newSizeY: 0,
			limitLeft: 0,
			limitRight: 0,
		},
	});
	return newXmlConfig;
};

const updateXmlConfig = async (postId, req) => {
	const xmlConfig = database.XmlConfig.update({
		where: {
			id: postId,
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
			id: postId,
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
