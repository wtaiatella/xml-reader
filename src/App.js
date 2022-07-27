import React from 'react';
import { UserStorage } from './contexts/UserContext';
import styled from 'styled-components';
import './App.css';
import { Header } from './components/Header';
import { MainBlock } from './components/MainBlock';

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
	max-width: 1300px;
	margin: 0 auto;
`;

const App = () => {
	return (
		<UserStorage>
			<Container>
				<Content>
					<Header />
					<MainBlock />
				</Content>
			</Container>
		</UserStorage>
	);
};

export default App;
