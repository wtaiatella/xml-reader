import styled from 'styled-components';

export const Container = styled.div`
	display: flex;
	flex-direction: column;

	.headerTable {
		padding: 15px 20px 0 20px;

		p:first-child {
			padding-bottom: 7px;
		}
	}

	.buttonsTable {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		padding: 20px;
	}

	.buttonSave {
		margin-left: 30px;
	}

	.tableData {
		flex-grow: 1;
	}

	.ant-table-thead > tr > th,
	.ant-table-tbody > tr > td,
	.ant-table tfoot > tr > th,
	.ant-table tfoot > tr > td,
	.ant-table-column-sort {
		padding: 5px 16px;
		border-bottom: 1px solid black;
		background-color: #18fcf4;
	}

	.ant-table-tbody > tr > td .ant-table,
	td.ant-table-column-sort {
		background-color: #18fcf4;
	}

	.ant-table-filter-trigger {
		color: black;
		font-size: 1em;
	}

	.ant-table-thead
		> tr
		> th:not(:last-child):not(.ant-table-selection-column):not(
			.ant-table-row-expand-icon-cell
		):not([colspan])::before {
		background-color: rgba(0, 0, 0, 1) !important;
	}

	.ant-table-cell {
		border-bottom: 1px solid rgba(0, 0, 0, 0.88) !important;
		border-top: transparent !important;
		border-start-start-radius: 0px !important;
		border-end-start-radius: 0px !important;
		border-start-end-radius: 0px !important;
		border-end-end-radius: 0px !important;
	}
`;
