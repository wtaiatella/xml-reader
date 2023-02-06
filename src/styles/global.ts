import { createGlobalStyle } from 'styled-components';
import styled from 'styled-components';

export const GlobalStyle = createGlobalStyle`

:root {
	
	--red: #e52e4d;
	--blue: #5429cc;
	--green: #33cc95;

	--blue-light: #6933ff;

	--text-title: #363f5f;
	--text-body: #969cb3;

	--background: #f8f2f5;	
	--shape: #fff;
}


*{
	margin: 0;
	padding: 0;
	box-sizing: border-box;
}

// font-size standard: 16px for desktops
html{
	@media (max-width: 1080px) {
		//16 pix * 0,9375 = 15px
		font-size: 93.75%;
	}
	
	@media (max-width: 720px) {
		//16 pix * 0,875 = 15px
		font-size: 87.5%;
	}

}

body{
	-webkit-font-smoothing: antialiased;
}

body, input, textarea, select, button {
	font-family: 'Poppins', sans-serif;
	font-weight: 400;
}

h1, h2, h3, h4, h5, h6, strong {
	font-weight: 600;
}

a {
	color: inherit;
	text-decoration: none;
}

button {
	cursor: pointer;
}



`;

export const Container = styled.div`
	padding: 0 50px;
	font-size: calc(1px + 2vmin);
	background-color: #18fcf4;
`;

export const Content = styled.div`
	min-height: 100vh;
	display: flex;
	flex-direction: column;
	color: black;
	max-width: 1400px;
	margin: 0 auto;
`;
