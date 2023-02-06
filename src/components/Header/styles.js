import styled from 'styled-components';

export const Container = styled.header`
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 1.5em;
	border-bottom: 2px solid black;

	.fileInput {
		padding: 0.5em 1em;

		.FileButton {
			display: inline-block;
			background-color: buttonface;
			padding: 0.3em;
			font-size: 1em;
			border-width: 2px;
			border-style: outset;
			border-color: buttonborder;
		}

		.FileName {
			display: inline-block;
			margin: 0 1em;
			font-size: 1.3em;
		}

		input {
			display: none;
		}
	}

	.Menu {
		display: flex;
		flex-direction: column;
		align-items: center;

		width: 200px;

		button {
			width: 150px;
			display: inline-block;
		}

		button:first-child {
			margin-bottom: 1.2em;
		}
	}
`;
