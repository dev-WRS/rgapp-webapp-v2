import { useEffect, useMemo, useState } from 'react'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Divider from '@mui/material/Divider'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import Alert from '@mui/material/Alert'
import Typography from '@mui/material/Typography'
import moment from 'moment'

import DataTable from 'components/core/DataTable'
import Spinner from 'components/core/Spinner'
import DataFilters, { operators } from 'components/core/DataFilters'
import Actions from 'components/core/Actions'
import Action from 'components/core/Action'
import Snackbar from 'components/core/Snackbar'
import DeleteByDateForm from 'components/DeleteByDateForm'

import { hexid } from 'helpers'
import { MSG_TYPE } from 'constants'
import { Icon } from 'styles';
import { useTheme } from '@emotion/react'

const filterFn = filters => item => {
	const ln = filters.length
	let result = true
	let i = 0

	while (result === true && i < ln) {
		const filter = filters[i]
		const itemValue = filter.column && filter.column.calculate ? filter.column.calculate(item) : item[filter.property]
        if (filter.dataType === 'date') {
			console.log('filter.value', filter.value)
			console.log('itemValue', itemValue)

            const formattedFilterValue = moment(filter.value).startOf('day').format('MM/DD/YYYY HH:mm');
            const formattedItemValue = moment(itemValue).startOf('day').format('MM/DD/YYYY HH:mm');

			console.log('formattedFilterValue', formattedFilterValue)
			if (formattedItemValue === '01/19/2024 00:00') {
				console.log('formattedItemValue', formattedItemValue)
			}

            result = result && operators[filter.operator].fn(formattedFilterValue, formattedItemValue, filter.dataType);
			if (result === true) console.log('result', result)
        } else {
			result = result && operators[filter.operator].fn(filter.value, itemValue, filter.dataType)
		}
		i++
	}
	return result
}

const filtering = (items, filters = []) => {
	return (filters.length > 0) ? items.filter(filterFn(filters)) : items
}

const searchFn = (criteria, props) => item => {
	const ln = props.length
	let result = false
	let i = 0

	while (result === false && i < ln) {
		const property = props[i]
		result = result || String(item[property]).toLowerCase().indexOf(String(criteria).toLowerCase()) !== -1
		i++
	}
	return result
}

const searching = (items, search = {}) => {
	const { criteria, props } = search
	return (criteria && props && props.length > 0) ?
		items.filter(searchFn(criteria, props)) : items
}

const actionKey = (key, suffix) => suffix ? `${key}-${suffix}` : key

const DataBrowser = ({
	sx,
	actions = [],
	columns = [],
	rows = [],
	multiSelect = false,
	defaultAction,
	context,
	isLoading,
	onRefresh,
	onSelectionChange,
	onAction,
	onActionClose,
	showTotalType,
	dialogOpened,
	origin
}) => {
	const theme = useTheme()
	const searchables = useMemo(() => columns
		.filter(column => !!column.searchable)
		.map((column) => ({
			label: column.label,
			property: column.dataKey,
			column
		}))
		, [columns])
	const filterables = useMemo(() => columns
		.filter(column => !!column.filterable)
		.map((column) => ({
			label: column.label,
			property: column.dataKey,
			dataType: column.dataType,
			column
		}))
		, [columns])
	const [searchState, setSearchState] = useState()
	const [filtersState, setFiltersState] = useState([])
	const [selectionState, setSelectionState] = useState([])
	const [currentActionState, setCurrentActionState] = useState()
	const [openMsgState, setOpenMsgState] = useState(false)
	const [msgState, setMsgState] = useState()
	const [openDialog, setOpenDialog] = useState(false)

	useEffect(() => {
		(rows && rows.length > 0) && setSelectionState(prevSelection => prevSelection.reduce((result, { id }) => {
			const item = rows.find(item => item.id === id)
			if (item) result.push(item)
			return result
		}, []))
	}, [rows])

	const handleDeleteByDateDialog = () => {
		setOpenDialog(true)
		dialogOpened(true)
	}
	const handleCloseDialog = () => {
		setOpenDialog(false)
		dialogOpened(false)
	}
	const handleSearch = (criteria) => {
		setSearchState({ criteria, props: searchables ? searchables.map(({ property }) => property) : [] })
	}

	const handleClearSearch = () => {
		setSearchState()
	}

	const handleApplyFilter = (filter) => {
		const filterIndex = filtersState.findIndex(item => item.property === filter.property)
		const newFilters = [...filtersState]

		if (filterIndex === -1) {
			newFilters.push({ ...filter })
		}
		else {
			newFilters[filterIndex] = { ...filter }
		}

		setFiltersState(newFilters)
	}

	const handleDeleteFilter = (filter) => {
		const filterIndex = filtersState.findIndex(item => item.property === filter.property)

		if (filterIndex !== -1) {
			filtersState.splice(filterIndex, 1)
		}

		setFiltersState([...filtersState])
	}

	const handleSelectionChange = (selection) => {
		setSelectionState([...selection])
		onSelectionChange && onSelectionChange(selection)
	}

	const handleRowDoubleClick = () => {
		if (!(defaultAction.disabled && defaultAction.disabled(selectionState))) {
			setCurrentActionState({
				suffix: hexid(),
				...defaultAction
			})
			onAction && onAction(selectionState, defaultAction)
		}
	}

	const handleAction = (action) => (event) => {
		if (openMsgState) {
			handleMsgClose()
		}
		setCurrentActionState({
			suffix: hexid(),
			...action
		})
		onAction && onAction(selectionState, action)
	}

	const handleActionClose = (message) => {
		onActionClose && onActionClose(currentActionState, message)

		if (!message || (message && message.type !== MSG_TYPE.error)) {
			setCurrentActionState(null)
		}

		if (message && MSG_TYPE[message.type]) {
			setMsgState({ ...message })
			setOpenMsgState(true)
		}
	}

	const handleMsgClose = () => {
		setMsgState(null)
		setOpenMsgState(false)
	}

	return (
		<>
			<Stack sx={{
				flexDirection: 'column',
				height: '100%'
			}}>
				<Stack sx={{
					flexDirection: 'row',
					mb: 2
				}}>
					{((searchables && searchables.length > 0) || (filterables && filterables.length > 0)) && (
						<Paper sx={{
							boxShadow: 'none'
						}}>
							<DataFilters.SearchBox
								selected={filtersState}
								searchables={searchables}
								filterables={filterables}
								onSearch={handleSearch}
								onClearSearch={handleClearSearch}
								onApplyFilter={handleApplyFilter}
							/>
						</Paper>
					)}
					{(showTotalType !== undefined && showTotalType.showTotal === true) && (
						<Typography sx={{ marginTop: '10px' }}>Total {showTotalType.type}: {rows.length}</Typography>
					)}
					<Box sx={{ flexGrow: 1 }} />
					<Box sx={{ alignSelf: "center", display: "flex" }} >
						{actions.length > 0 && actions.map(action => {
								return <Box key={action.key} sx={{ alignSelf: "center", display: "flex" }}>
										{action.separator && (<Divider orientation="vertical" sx={{ marginRight: .5, marginLeft: .5, height: "15px", alignSelf: "center" }} />)}
										<Tooltip title={action.label}  arrow>
											<span>
												<IconButton
													disabled={action.disabled && action.disabled(selectionState, action)}
													onClick={handleAction(action)}
													sx={{ marginRight: .5, marginLeft: .5, stroke: action.disabled && action.disabled(selectionState, action) ? theme.palette.brand.lightbeige : theme.palette.text.primary, strokeWidth: "15px" }}
												>
													<Icon icon={action.icon} size={action.iconSize || 22} color={action.disabled && action.disabled(selectionState, action) ? theme.palette.brand.lightbeige : theme.palette.text.primary} />
												</IconButton>
											</span>
										</Tooltip>
									</Box>
							}
						)}
					</Box>
					{(actions.length > 0) && (
						<Divider orientation="vertical" sx={{ marginRight: .5, marginLeft: .5, height: "15px", alignSelf: "center" }} />
					)}
					<Box sx={{ alignSelf: "center" }} >
						{onRefresh && (
							<Tooltip title="Refresh" arrow>
								<span>
									<IconButton
										onClick={onRefresh}
										sx={{ marginRight: .5, marginLeft: .5, stroke: theme.palette.text.primary, strokeWidth: "15px" }}
									>
										<Icon icon="reload" color={theme.palette.text.primary} size={22} />
									</IconButton>
								</span>
							</Tooltip>
						)}
						{ (origin && origin === 'projects') && (
							<Tooltip title="Custom Delete" arrow>
							<span>
								<IconButton
									onClick={handleDeleteByDateDialog}
									sx={{ marginRight: .5, marginLeft: .5, stroke: theme.palette.text.primary, strokeWidth: "15px" }}
								>
									<Icon icon="broom" color={theme.palette.text.primary} size={22} />
								</IconButton>
							</span>
							</Tooltip>
						)}
						<Tooltip title="Columns" arrow>
							<span>
								<IconButton
									sx={{ stroke: theme.palette.text.primary, strokeWidth: "15px" }}
								>
									<Icon icon="columns-2" color={theme.palette.text.primary} size={22} />
								</IconButton>
							</span>
						</Tooltip>
					</Box>
				</Stack>
				<DataFilters.FiltersList sx={{ mb: 2 }}
					filters={filtersState}
					onDeleteFilter={handleDeleteFilter}
				/>
				<Paper sx={{
					flex: 1,
					boxShadow: 'none',
					overflowY: !isLoading ? 'scroll' : 'none',
					...sx
				}}> {
					!isLoading
						? <DataTable
							multiSelect={multiSelect}
							columns={columns}
							rows={searching(filtering(rows, filtersState), searchState)}
							filters={filtersState}
							onSelectionChange={handleSelectionChange}
							onRowDoubleClick={handleRowDoubleClick}
							/>
						: <Spinner></Spinner>
				}
				</Paper>
			</Stack>
			<Actions current={currentActionState}>
				{actions.map(action => (
					<Action key={actionKey(action.key, currentActionState ? currentActionState.suffix : null)}
						context={context}
						name={action.key}
						element={action.element}
						isLoading={isLoading}
						selection={selectionState}
						onClose={handleActionClose}
					/>
				))}
			</Actions>
			{(openMsgState) && (
				<Snackbar open={openMsgState} autoHideDuration={6000} onClose={handleMsgClose}>
					<Alert onClose={handleMsgClose} severity={msgState.type} variant="filled">
						{msgState.message}
					</Alert>
				</Snackbar>
			)}
			{openDialog && (
				<DeleteByDateForm
					open={openDialog}
					onCancel={handleCloseDialog}
				/>
			)}
		</>
	)
}

export default DataBrowser