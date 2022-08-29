import styled from 'styled-components';

export const Container = styled.div`
	margin-top: 1.5em;

	.Worldmap {
		display: flex;
		align-items: center;
		font-size: 1.2em;
		margin-bottom: 1em;
	}

	.LabelField {
		display: block;
		margin-right: 1em;
		font-size: 1em;
		font-weight: bold;
	}

	.Titulo {
		font-size: 1.5em;
		margin-bottom: 30px;
	}

	Button {
		background-color: buttonface;
		color: black;
		padding: 0.2em 0.5em;
		margin-left: 3em;
		font-size: 1em;
		height: auto;
		border: 2px solid black;
		.anticon {
			margin-right: 0.5em;
			display: inline;
		}
	}
	.Container {
		display: flex;
		padding: 0 2em;
		margin-bottom: 2em;
	}

	.ButtonSave {
		margin-left: 2em;
	}
`;
