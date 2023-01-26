import styled from 'styled-components';

export const Container = styled.div`
	display: flex;
	flex-direction: column;

	.headerTable {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		padding: 20px;
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
`;
