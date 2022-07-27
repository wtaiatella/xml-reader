import { createContext, useState } from 'react';

export const UserContext = createContext();

export const UserStorage = ({ children }) => {
	const [sizes, setSizes] = useState('');
	const [xmlData, setXmlData] = useState({
		fileName: '',
		xml: null,
		worldmaps: null,
		posAtual: 0,
		quantidade: 0,
		Name: '',
		ZoomFactor: '0',
		Width: '0',
		PixelRatio: '0',
		MaxY: '0',
		MaxX: '0',
		Height: '0',
	});
	const [resumo, setResumo] = useState(false);

	return (
		<UserContext.Provider
			value={{
				sizes,
				setSizes,
				xmlData,
				setXmlData,
				resumo,
				setResumo,
			}}
		>
			{children}
		</UserContext.Provider>
	);
};
