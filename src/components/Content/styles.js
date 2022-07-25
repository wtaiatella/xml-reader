import styled from 'styled-components';

export const Container = styled.div`
	margin-top: 1.5em;

	.FileName {
		font-size: 1.2em;
		margin: 1em 0;
		strong {
			font-size: 1em;
		}
	}

	.Worldmap {
		display: flex;
		align-items: center;
		font-size: 1.2em;
		strong {
			font-size: 1em;
		}
	}

	Button {
		width: 150px;
		height: 40px;
		margin-left: 3em;
		font-size: 1em;
		.anticon {
			margin-right: 0.5em;
		}
	}
	.Container {
		display: flex;
		padding: 0 2em;
		margin-top: 2em;
	}
`;
