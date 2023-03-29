import { useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'

import Paper from '@mui/material/Paper'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'

import DataBrowser from 'components/core/DataBrowser'
import EnterDataOptions from 'components/EnterDataOptions'
import BuildingForm from 'components/BuildingForm'

import { createBuilding } from 'actions'
import { MSG_TYPE } from 'constants'

const buildingValidate = (building) => {
	const { name, type, address, qualifyingCategories, area, rate, method } = building
	return !!name && 
		!!type && 
		!!address && 
		(qualifyingCategories && qualifyingCategories.length > 0) &&
		!!area &&
		!!rate &&
		!!method
}

const BuildingList = ({
	context,
	actions,
	buildings,
	defaultAction,
	onRefresh,
	onActionClose
}) => {
	const dispatch = useDispatch()
	const columns = useMemo(() => [
		{ label: 'Name', dataKey: 'name', dataType: 'string', disablePadding: false, render: undefined },
		{ label: 'Type', dataKey: 'type', dataType: 'string', disablePadding: false, render: undefined },
		{ label: 'Area', dataKey: 'area', dataType: 'string', disablePadding: false, 
			render: (row, column) => {
				return `${row[column.dataKey].toLocaleString('en-US', {maximumFractionDigits:2})} sqft`
			}
		},
		{ label: 'Rate', dataKey: 'rate', dataType: 'string', disablePadding: false, 
			render: (row, column) => {
				return `$${row[column.dataKey].toFixed(2)}`
			}
		}
	], [])
	const [openState, setOpenState] = useState(false)
	const [openMsgState, setOpenMsgState] = useState(false)
	const [msgState, setMsgState] = useState()

	const handleEnterManually = () => {
		setOpenState(true)
	}

	const handleValueChange = async (data) => {
		const { error } = await dispatch(createBuilding(context.id, data))

		if (error) {
			setMsgState({
				type: MSG_TYPE.error,
				message: error.message
			})
		}
		else {
			setMsgState({
				type: MSG_TYPE.success,
				message: 'The buildings has been successfully created'
			})
		}
		setOpenMsgState(true)
	}

	const handleSubmit = async (state) => {
		const { error } = await dispatch(createBuilding(context.id, [state]))

		if (error) {
			setMsgState({
				type: MSG_TYPE.error,
				message: error.message
			})
		}
		else {
			setMsgState({
				type: MSG_TYPE.success,
				message: 'The building has been successfully created'
			})
		}
		setOpenMsgState(true)
		setOpenState(false)
	}

	const handleCancel = () => {
		setOpenState(false)
	}

	const handleMsgClose = () => {
		setMsgState(null)
		setOpenMsgState(false)
	}

	return (
		<Paper sx={{
			marginBottom: '25px',
			boxShadow: 'none'
		}}>
			{buildings.length > 0 ? (
				<DataBrowser
					sx={{
						minHeight: '302px',
						maxHeight: '302px',
						overflow: 'scroll'
					}}
					actions={actions}
					columns={columns}
					rows={buildings}
					multiSelect={true}
					defaultAction={defaultAction}
					context={context}
					onRefresh={onRefresh}
					onActionClose={onActionClose}
				/>
			) : (
				<>
					<EnterDataOptions
						csvOptions={{ validate: buildingValidate }}
						onValueChange={handleValueChange}
						onEnterManually={handleEnterManually}
					/>
					<BuildingForm
						open={openState}
						context={context}
						onSubmit={handleSubmit}
						onCancel={handleCancel}
					/>
				</>
			)}
			
			{(openMsgState) && (
				<Snackbar open={openMsgState} autoHideDuration={6000} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} onClose={handleMsgClose}>
					<Alert onClose={handleMsgClose} severity={msgState.type} variant="filled">
						{msgState.message}
					</Alert>
				</Snackbar>
			)}
		</Paper>
	)
}

export default BuildingList