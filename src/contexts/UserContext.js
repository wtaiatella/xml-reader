import { createContext, useState } from 'react';

export const UserContext = createContext();

export const UserStorage = ({ children }) => {
	const [worldmapsTable, setWorldmapsTable] = useState([]);
	const [xmlData, setXmlData] = useState({
		fileName: '',
		xml: null,
		worldmaps: null,
		worldgroupName: '',
		quantWorldmaps: 0,
		quantWorldGroups: 0,
		xmlConfig: [],
	});

	return (
		<UserContext.Provider
			value={{
				xmlData,
				setXmlData,
				worldmapsTable,
				setWorldmapsTable,
			}}
		>
			{children}
		</UserContext.Provider>
	);
};
