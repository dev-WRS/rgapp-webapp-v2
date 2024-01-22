import { useState } from 'react'
import { styled } from '@mui/material/styles'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import MuiTableHead from '@mui/material/TableHead'
import MuiTableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'
import Checkbox from '@mui/material/Checkbox'
import moment from 'moment'


const TableRow = styled(MuiTableRow)(({ theme }) => ({
	'&.MuiTableRow-root': {
		cursor: 'pointer'
	},
	'.MuiTableCell-head': {
		color: theme.palette.text.light
	}
}))

const defaultSorter = { direction: 'asc' }

const compare = (a, b, property) => {
    if (property === 'createDate' || property === 'reportCreateDate') {
        const dateA = moment(a[property]);
        const dateB = moment(b[property]);
        if (dateA.isBefore(dateB)) return -1;
        if (dateA.isAfter(dateB)) return 1;
        return 0;
    } else {
        if (a[property] < b[property]) return -1;
        if (a[property] > b[property]) return 1;
        return 0;
    }
};

const stableSort = (items, cmp) => {
	const stabilizedThis = items.map((item, index) => [item, index])
	stabilizedThis.sort((a, b) => {
		const order = cmp(a[0], b[0])
		return (order !== 0) ? order : (a[1] - b[1])
	})
	return stabilizedThis.map(item => item[0])
}

const sortFn = (property, direction) => {
	return (direction === 'desc') ? (a, b) => compare(a, b, property) : (a, b) => -compare(a, b, property)
}

const sorting = (items, sorter) => {
	return (sorter && sorter.property && sorter.direction) ?
		stableSort(items, sortFn(sorter.property, sorter.direction)) :
		items
}

const SortLabelSpan = styled('span')(({ theme }) => ({
	border: 0,
	clip: 'rect(0 0 0 0)',
	height: 1,
	margin: -1,
	overflow: 'hidden',
	padding: 0,
	position: 'absolute',
	top: 20,
	width: 1
}))

const TableHead = ({
	columns,
	multiSelect,
	sorter = defaultSorter,
	numSelected,
	rowCount,
	onSelectAllClick,
	onRequestSort
}) => {
	const createSortHandler = property => event => onRequestSort(event, property)
	return (
		<MuiTableHead>
			<TableRow>
				{multiSelect && (
					<TableCell padding="checkbox">
						<Checkbox
							color='secondary'
							indeterminate={numSelected > 0 && numSelected < rowCount}
							checked={numSelected === rowCount}
							onChange={onSelectAllClick}
							inputProps={{ 'aria-label': 'select all' }}
						/>
					</TableCell>
				)}
				{columns.map(column => (
					<TableCell
						key={column.dataKey}
						//align={(column.dataType === 'number' && !column.render) ? 'right' : 'left'}
						padding={column.disablePadding ? 'none' : 'normal'}
						sortDirection={sorter.property === column.dataKey ? sorter.direction : false}
					>
						<TableSortLabel
							active={sorter.property === column.dataKey}
							direction={sorter.direction}
							onClick={createSortHandler(column.dataKey)}
						>
							{column.label}
							{sorter.property === column.dataKey ? (
								<SortLabelSpan>
									{sorter.direction === 'desc' ? 'sorted descending' : 'sorted ascending'}
								</SortLabelSpan>
							) : null}
						</TableSortLabel>
					</TableCell>
				))}
			</TableRow>
		</MuiTableHead>
	)
}

const DataTable = ({
	idProperty = 'id',
	multiSelect,
	columns = [],
	rows = [],
	sorter = defaultSorter,
	onSelectionChange,
	onRowClick,
	onRowDoubleClick
}) => {
	const [selectionState, setSelectionState] = useState([])
	const [sorterState, setSorterState] = useState(sorter)

	const isSelected = id => (selectionState.findIndex(item => item[idProperty] === id) !== -1)

	const handleSelectAll = (event) => {
		const newSelection = (event.target.checked) ? [...rows] : []
		setSelectionState(newSelection)
		onSelectionChange && onSelectionChange(newSelection)
	}

	const handleSelect = (row) => (event) => {
		const id = row[idProperty]
		const selectedIndex = selectionState.findIndex(item => item[idProperty] === id)
		let newSelection = []

		event.stopPropagation()

		if (selectedIndex === -1) {
			newSelection = newSelection.concat(selectionState, { ...row })
		}
		else if (selectedIndex === 0) {
			newSelection = newSelection.concat(selectionState.slice(1))
		}
		else if (selectedIndex === selectionState.length - 1) {
			newSelection = newSelection.concat(selectionState.slice(0, -1))
		}
		else if (selectedIndex > 0) {
			newSelection = newSelection.concat(
				selectionState.slice(0, selectedIndex),
				selectionState.slice(selectedIndex + 1),
			)
		}

		setSelectionState(newSelection)
		onSelectionChange && onSelectionChange(newSelection)
	}

	const handleSingleSelect = (row) => (event) => {
		const newSelection = [{ ...row }]

		event.stopPropagation()

		setSelectionState(newSelection)
		onSelectionChange && onSelectionChange(newSelection)
	}

	const handleRowClick = (row) => (event) => {
		handleSingleSelect(row)(event)
		onRowClick && onRowClick(row)
	}

	const handleRowDoubleClick = (row) => (event) => {
		handleSingleSelect(row)(event)
		onRowDoubleClick && onRowDoubleClick(row)
	}

	const handleRequestSort = (event, property) => {
		const isDesc = (sorterState.property === property && sorterState.direction === 'desc')
		const newDirection = isDesc ? 'asc' : 'desc'
		setSorterState({ property, direction: newDirection })
	}

	return (
		<Table stickyHeader>
			<TableHead
				columns={columns}
				multiSelect={multiSelect}
				sorter={sorterState}
				numSelected={selectionState.length}
				rowCount={rows.length}
				onSelectAllClick={handleSelectAll}
				onRequestSort={handleRequestSort}
			/>
			<TableBody>
				{sorting(rows, sorterState).map((row, rowIndex) => {
					const labelId = `table-checkbox-${rowIndex}`
					const isRowSelected = isSelected(row[idProperty])

					return (
						<TableRow key={rowIndex}
							aria-checked={isRowSelected}
							selected={isRowSelected}
							role="checkbox"
							tabIndex={-1}
							hover
							onClick={handleRowClick(row)}
							onDoubleClick={handleRowDoubleClick(row)}
						>
							{multiSelect && (
								<TableCell padding="checkbox">
									<Checkbox
										color='secondary'
										checked={isRowSelected}
										inputProps={{ 'aria-labelledby': labelId }}
										onChange={handleSelect(row)}
										onClick={handleSelect(row)}
									/>
								</TableCell>
							)}
							{columns.map((column, columnIndex) => {
								const value = column.format ? column.format(row[column.dataKey]) : row[column.dataKey]
								return (
									<TableCell key={columnIndex}>{
										column.render ? column.render(row, column) :
											column.calculate ? column.calculate(row) :
												value
									}</TableCell>
								)
							})}
						</TableRow>
					)
				})}
			</TableBody>
		</Table>
	)
}

export default DataTable