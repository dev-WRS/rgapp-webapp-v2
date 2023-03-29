import { useSelector, useDispatch } from 'react-redux'
import { useState } from 'react'

import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'

import DwellingInfoForm from 'components/DwellingInfoForm'

import { updateProjectDwellingUnit } from 'actions'
import { MSG_TYPE } from 'constants'

const DwellingInfo = ({
	mode,
	submit,
	projectId,
	isLoading,
	inProgress,
	onSubmit,
	onCancel
}) => {
	const dispatch = useDispatch()
	const project = useSelector(state => state.projects && state.projects.data &&
		projectId && state.projects.data.find(project => project.id === projectId))

	const [openMsgState, setOpenMsgState] = useState(false)
	const [msgState, setMsgState] = useState()

	console.log('Dwelling Info', project)

	const handleSubmit = async (state) => {
		const { error } = await dispatch(updateProjectDwellingUnit(projectId, state))

		if (error) {
			setMsgState({
				type: MSG_TYPE.error,
				message: error.message
			})

			onSubmit && onSubmit(false)
		}
		else {
			setMsgState({
				type: MSG_TYPE.success,
				message: 'The dwelling info has been successfully updated'
			})

			onSubmit && onSubmit(true)
		}
		setOpenMsgState(true)
	}

	const handleMsgClose = () => {
		setMsgState(null)
		setOpenMsgState(false)
	}

	return (
		<>
			<DwellingInfoForm
				mode={mode}
				record={project}
				submit={submit}
				isLoading={isLoading}
				inProgress={inProgress}
				onSubmit={handleSubmit}
				onCancel={onCancel}
			/>
			{(openMsgState) && (
				<Snackbar open={openMsgState} autoHideDuration={6000} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} onClose={handleMsgClose}>
					<Alert onClose={handleMsgClose} severity={msgState.type} variant="filled">
						{msgState.message}
					</Alert>
				</Snackbar>
			)}
		</>
	)
}

export default DwellingInfo