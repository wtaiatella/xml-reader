import React from 'react';
import { UserStorage } from './contexts/UserContext';
//import '~antd/dist/antd.css';
import './App.css';
import { Header } from './components/Header';
import { Content } from './components/Content';

const App = () => {
	return (
		<UserStorage>
			<div className='App'>
				<div className='App-body'>
					<Header />
					<Content />
				</div>
			</div>
		</UserStorage>
	);
};

export default App;
