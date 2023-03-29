import { useMemo, useState  } from 'react'
import { useDispatch } from 'react-redux'

import Paper from '@mui/material/Paper'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'

import DataBrowser from 'components/core/DataBrowser'
import EnterDataOptions from 'components/EnterDataOptions'
import DwellingUnitForm from 'components/DwellingUnitForm'

import { createDwellingUnit } from 'actions'
import { MSG_TYPE } from 'constants'

const dwellingValidate = (dwelling) => {
	const { address } = dwelling
	return !!address
}

const DwellingUnitList = ({
	context,
	actions,
	dwellingUnits,
	defaultAction,
	onRefresh,
	onActionClose
}) => {
	const dispatch = useDispatch()
	const columns = useMemo(() => [
		{ label: 'Model', dataKey: 'model', dataType: 'string', disablePadding: false, render: undefined },
		{ label: 'Address', dataKey: 'address', dataType: 'string', disablePadding: false, render: undefined }
	], [])
	const [openState, setOpenState] = useState(false)
	const [openMsgState, setOpenMsgState] = useState(false)
	const [msgState, setMsgState] = useState()

	const handleEnterManually = () => {
		setOpenState(true)
	}

	const handleValueChange = async (data) => {
		const { error } = await dispatch(createDwellingUnit(context.id, data))

		if (error) {
			setMsgState({
				type: MSG_TYPE.error,
				message: error.message
			})
		}
		else {
			setMsgState({
				type: MSG_TYPE.success,
				message: 'The dwellings has been successfully created'
			})
		}
		setOpenMsgState(true)
	}

	const handleSubmit = async (state) => {
		const { error } = await dispatch(createDwellingUnit(context.id, [state]))

		if (error) {
			setMsgState({
				type: MSG_TYPE.error,
				message: error.message
			})
		}
		else {
			setMsgState({
				type: MSG_TYPE.success,
				message: 'The dwelling unit has been successfully created'
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
			{dwellingUnits.length > 0 ? (
				<DataBrowser
					sx={{
						minHeight: '302px',
						maxHeight: '302px',
						overflow: 'scroll'
					}}
					actions={actions}
					columns={columns}
					rows={dwellingUnits}
					multiSelect={true}
					defaultAction={defaultAction}
					context={context}
					onRefresh={onRefresh}
					onActionClose={onActionClose}
				/>
			) : (
				<>
					<EnterDataOptions
						csvOptions={{ validate: dwellingValidate }}
						onValueChange={handleValueChange}
						onEnterManually={handleEnterManually}
					/>
					<DwellingUnitForm
						open={openState}
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

export default DwellingUnitList