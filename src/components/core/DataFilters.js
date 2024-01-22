import { useEffect, useMemo, useState } from 'react'
import { useTheme } from '@emotion/react'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import moment from 'moment'

import Popover from '@mui/material/Popover'

import RadioGroup from '@mui/material/RadioGroup'
import Radio from '@mui/material/Radio'
import FormControlLabel from '@mui/material/FormControlLabel'

import Chip from '@mui/material/Chip'

import Button from 'components/core/Button'
import SearchField from 'components/core/SearchField'
import TextField from 'components/core/TextField'
import NumberField from 'components/core/NumberField'
import DateField from 'components/core/DateField'
import DateTimeField from 'components/core/DateTimeField'
import SelectField from 'components/core/SelectField'

export const operators = {
	'eq': { label: 'is', fn: (a, b, dataType) => {
		return (dataType === 'string') ? (String(a).toLowerCase() === String(b).toLowerCase()) : (a === b) 
	} },
	'neq': { label: 'is not', fn: (a, b, dataType) => {
		return (dataType === 'string') ? (String(a).toLowerCase() !== String(b).toLowerCase()) : (a !== b) 
	} },
	'lt': { label: 'is less than', fn: (filterValue, value) => {
		return (value < filterValue)
	} },
	'gt': { label: 'is greather than', fn: (filterValue, value) => {
		return (value > filterValue)
	} },
	'in': { label: 'contains', fn: (filterValue, value) => {
		return (String(value).toLowerCase().indexOf(String(filterValue).toLowerCase()) !== -1)
	} }
}

const operDataType = {
	string: ['eq', 'neq', 'in'],
	number: ['eq', 'lt', 'gt'],
	date: ['eq', 'lt', 'gt'],
	datetime: ['eq', 'lt', 'gt'],
	select: ['eq', 'neq']
}

const transformValue = {
	number: (value) => {
		try {
			return Number(value)
		}
		catch (error) {
			return 0
		}
	},
	date: (momentValue) => momentValue.toDate(),
	datetime: (momentValue) => momentValue.toDate()
}

const fieldDataType = {
	string: TextField,
	number: NumberField,
	date: DateField,
	datetime: DateTimeField,
	select: SelectField
}

const FiltersDialog = ({ 
	filterables = [],
	anchorEl,
	open,
	onClose,
	onItem
}) => {
	const theme = useTheme()
	const [value, setValue] = useState()

	const handleItem = (filter) => (event) => {
		setValue(filter.property)
		onItem && onItem(filter, event)
	}

	return (
		<Menu
			id="filters-dialog-menu"
			anchorEl={anchorEl}
			open={open}
			onClose={onClose}
			MenuListProps={{
				'aria-labelledby': 'basic-button'
			}}
			anchorOrigin={{
				vertical: 'top',
				horizontal: 'right'
			}}
			transformOrigin={{
				vertical: 'top',
				horizontal: 'left'
			}}
			PaperProps={{
				sx: {
					minWidth: theme.spacing(15),
					transform: `translate(${theme.spacing(1)}, 0px) !important`
				}
			}}
		>
			{filterables.map(filter => (
				<MenuItem key={filter.property}
					selected={filter.property === value}
					onMouseEnter={handleItem(filter)}
				>{filter.label}</MenuItem>
			))}
		</Menu>
	)
}

const FilterDialog = ({
	defaultFilter,
	filter,
	anchorEl,
	open,
	onClose,
	onApply
}) => {
	const theme = useTheme()
	const [operator, setOperator] = useState(operDataType[filter.dataType][0])
	const [value, setValue] = useState(null)

	useEffect(() => {
		if (defaultFilter) {
			setOperator(defaultFilter.operator || operDataType[filter.dataType][0])
			setValue(defaultFilter.value || null)	
		}
	}, [defaultFilter, filter])

	const handleChange = (event) => {
		setOperator(event.target.value)
	}

	const handleValueChange = (event) => {
		const transform = transformValue[filter.dataType]
		setValue(transform 
			? filter.dataType === 'date' ? moment(transform(event.target.value)).startOf('day').format('MM/DD/YYYY') : transform(event.target.value) 
			: event.target.value)
	}

	const handleKeyPress = (event) => {
		if (event.key === "Enter") {
			handleApply()
		}
	}

	const handleApply = () => {
		value && onApply && onApply({
			...filter,
			operator, value
		})
	}

	return (
		<Popover
			id="filter-dialog-popover"
			anchorEl={anchorEl} 
			open={open}
			onClose={onClose}
			anchorOrigin={{
				vertical: 'top',
				horizontal: 'right'
			}}
			transformOrigin={{
				vertical: 'top',
				horizontal: 'left'
			}}
			PaperProps={{
				sx: {
					display: 'table', //trick
					minWidth: theme.spacing(30),
					transform: `translate(${theme.spacing(1)}, -${theme.spacing(1)}) !important`
				}
			}}
			sx={{
				position: 'fixed',
				height: 'fit-content',
				width: 'fit-content'
			}}
			keepMounted
			hideBackdrop={true}
		>
			<Box>
				<Stack sx={{
					padding: theme.spacing(1, 2, 2)	
				}}>
					<RadioGroup
						value={operator}
						onChange={handleChange}
					>
						{operDataType[filter.dataType].map(oper => {
							const ValueField = fieldDataType[filter.dataType] || TextField
							const others = typeof(filter.column.filterable) === 'object' ? 
								filter.column.filterable : {}	

							return (
								<Stack key={oper}>
									<FormControlLabel key={`radio-${oper}`}
										label={operators[oper].label}
										value={oper} 
										control={<Radio size="small" color="secondary" />}
									/>
									{(String(operator) === String(oper)) && (
										<ValueField
											size="small" fullWidth autoFocus
											sx={{
												px: theme.spacing(1),
												pb: 0
											}}
											value={value || ''}
											onChange={handleValueChange}
											onKeyPress={handleKeyPress}
											{...others}
										/>
									)}
								</Stack>
							)
						})}
					</RadioGroup>	
				</Stack>
				<Stack
					direction="row"
					justifyContent="center"
					alignItems="center"
					spacing={2}
					sx={{
						padding: theme.spacing(0, 2, 2)	
					}}
				>
					<Button variant="outlined" size="medium"
						fullWidth
						color="cancel"
						onClick={onClose}
					>
						Cancel
					</Button>
					<Button variant="contained" size="medium"
						fullWidth
						color="secondary"
						sx={{
							color: 'white'
						}}
						// disabled={!value || (value && value.length === 0)}
						disabled={!value}
						onClick={handleApply}
					>
						Apply
					</Button>
				</Stack>
			</Box>
		</Popover>
	)
}

const SearchBox = ({
	selected,
	searchables,
	filterables,
	onSearch,
	onClearSearch,
	onApplyFilter
}) => {
	const [openFilters, setOpenFilters] = useState(false)
	const [openFilter, setOpenFilter] = useState(false)
	const [anchorFiltersEl, setAnchorFiltersEl] = useState(null)
	const [anchorFilterEl, setAnchorFilterEl] = useState(null)
	const [filterState, setFilterState] = useState(null)
	const defaultFilter = useMemo(() => {
		const match = (filterState && selected && selected.length > 0) && selected.find(item => item.property === filterState.property)
		return match || {}
	}, [filterState, selected])
	const placeholder = useMemo(() => ((searchables && searchables.length > 0) ?
		`${searchables.map(({ label }) => label).join(', ')}` : ''
	), [searchables])

	const handleSearch = (criteria) => {
		onSearch && onSearch(criteria)
	}

	const handleSearchFilter = (event) => {
		setAnchorFiltersEl(event.currentTarget)
		setOpenFilters(!openFilters)
	}

	const handleCloseFilters = () => {
		setAnchorFiltersEl(null)
		setOpenFilters(false)
		handleCloseFilter()
	}

	const handleFilterItem = (filter, event) => {
		handleCloseFilter()

		if (openFilters) {
			setAnchorFilterEl(event.currentTarget)
			setOpenFilter(true)
			setFilterState(filter)
		}
	}

	const handleCloseFilter = () => {
		setAnchorFilterEl(null)
		setOpenFilter(false)
		setFilterState(null)
	}

	const handleApplyFilter = (filter) => {
		setAnchorFilterEl(null)
		setOpenFilter(false)
		setFilterState(null)

		onApplyFilter && onApplyFilter(filter)
	}

	return (
		<>
			<SearchField
				placeholder={placeholder}
				onSearch={handleSearch}
				onClearSearch={onClearSearch}
				onFilter={(filterables && filterables.length > 0) ? handleSearchFilter : null}
			/>
			<FiltersDialog
				filterables={filterables}
				anchorEl={anchorFiltersEl}
				open={openFilters} 
				onClose={handleCloseFilters}
				onItem={handleFilterItem}
			/>
			{filterState && (<FilterDialog
				defaultFilter={defaultFilter}
				filter={filterState}
				anchorEl={anchorFilterEl}
				open={openFilter} 
				onClose={handleCloseFilter}
				onApply={handleApplyFilter}
			/>)}
		</>
	)
}

const FiltersList = ({
	filters = [],
	onDeleteFilter,
	...props
}) => {
	const handleDelete = (filter) => () => {
		onDeleteFilter && onDeleteFilter(filter)
	}

	return filters.length > 0 && (
		<Stack
			{...props}
			flexDirection="row"
			justifyContent="flex-start"
			alignItems="center"
		>
			{filters.map(filter => {
				const filterValue = (filter.column.filterable.options) ?
					filter.column.filterable.options.find(({ value }) => value === filter.value).text :
					filter.column.format ? filter.column.format(filter.value) : filter.value

				return (
					<Chip key={filter.property} size="small"
						label={<Typography component="span" sx={{ fontSize: '14px' }}>
							{`${filter.label} ${operators[filter.operator].label}`} <b>{filterValue}</b>
						</Typography>}
						sx={{ mx: 0.5 }}
						onDelete={handleDelete(filter)} 
					/>
				)
			})}
		</Stack>
	)
}

const DataFilters = { SearchBox, FiltersList }

export default DataFilters