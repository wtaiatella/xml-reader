import { database } from '../adapters/database';

const allWorldmaps = async () => {
	const worldmapTable = await database.Worldmaps.findMany({});

	return worldmapTable;
};

const findWorldmap = async (group, Name) => {
	const worldmap = await database.Worldmaps.findUnique({
		where: {
			group: group,
			name: Name,
		},
	});

	return worldmap;
};

const validateWorldmap = async (req) => {
	const dados = req.body;

	const exist = await database.Worldmaps.findUnique({
		where: {
			Name: dados.Name,
		},
	});

	if (exist) {
		return exist;
	} else {
		const created = await database.Worldmaps.create({
			data: {
				...req.body,
			},
		});
		return created;
	}
};

const createWorldmap = async (req) => {
	const newWorldmap = database.Worldmaps.create({
		data: {
			...req.body,
		},
	});
	return newWorldmap;
};

const updateWorldmap = async (postId, req) => {
	const worldmap = database.Worldmaps.update({
		where: {
			key: postId,
		},
		data: {
			...req.body,
		},
	});
	return worldmap;
};

const defaultFunctions = {
	allWorldmaps,
	findWorldmap,
	createWorldmap,
	validateWorldmap,
	updateWorldmap,
};

export default defaultFunctions;
