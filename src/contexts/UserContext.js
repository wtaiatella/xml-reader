import { createContext, useState } from 'react';

export const UserContext = createContext();

export const UserStorage = ({ children }) => {
	const [sizes, setSizes] = useState('');
	const [xmlData, setXmlData] = useState({
		fileName: '',
		xml: null,
		Name: '',
		ZoomFactor: '0',
		Width: '0',
		PixelRatio: '0',
		MaxY: '0',
		MaxX: '0',
		Height: '0',
	});

	return (
		<UserContext.Provider
			value={{
				sizes,
				setSizes,
				xmlData,
				setXmlData,
			}}
		>
			{children}
		</UserContext.Provider>
	);
};
