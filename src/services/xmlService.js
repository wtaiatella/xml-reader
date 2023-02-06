import { database } from '../adapters/database';

const findFiles = async () => {
	const files = await database.XmlConfig.findMany({});

	return files;
};

const findByUser = async (userId) => {
	const user = await database.user.findUnique({
		where: {
			id: userId,
		},
		include: { files: true },
	});

	if (user) {
		return user.files;
	}
	return [];
};

const findCategories = async () => {
	const categories = await database.fileCategory.findMany({});

	return categories;
};

const findSlug = async (fileSlug) => {
	const file = await database.file.findUnique({
		where: {
			slug: fileSlug,
		},
	});

	return file;
};

const fileDelete = async (filename) => {
	const name = await database.file.delete({
		where: {
			name: filename,
		},
	});

	return name;
};

const create = async (file) => {
	const { email } = file;

	const user = await database.user.findUnique({
		where: {
			email,
		},
	});

	if (user) {
		return database.file.create({
			data: {
				title: file.title,
				name: file.name,
				slug: file.slug,
				icon: file.icon,
				type: file.type,
				size: file.size,
				userId: user.id,
			},
		});
	} else {
		return ' falha de usuario';
	}
};

const defaultFunctions = {
	findFiles,
	findCategories,
	create,
	findSlug,
	findByUser,
	fileDelete,
};

export default defaultFunctions;
