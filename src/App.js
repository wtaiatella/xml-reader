import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { UserStorage } from './contexts/UserContext';
import styled from 'styled-components';
import './App.css';
import { Header } from './components/Header';
import { UpdateXml } from './components/UpdateXml';
import { XmlTable } from './components/XmlTable';
import { XmlMap } from './components/XmlMap';

const Container = styled.div`
	padding: 0;
	font-size: calc(1px + 2vmin);
	background-color: #18fcf4;
`;

const Content = styled.div`
	min-height: 100vh;
	display: flex;
	flex-direction: column;
	color: black;
	max-width: 1200px;
	margin: 0 auto;
`;

const App = () => {
	return (
		<BrowserRouter>
			<UserStorage>
				<Container>
					<Content>
						<Header />
						<Routes>
							<Route path='/' element={<UpdateXml />} />
							<Route path='/tabela' element={<XmlTable />} />
							<Route path='/mapa' element={<XmlMap />} />
						</Routes>
					</Content>
				</Container>
			</UserStorage>
		</BrowserRouter>
	);
};

export default App;
