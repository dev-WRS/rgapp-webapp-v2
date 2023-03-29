import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Alert from '@mui/material/Alert'

import Snackbar from 'components/core/Snackbar'
import MainLayout from 'components/MainLayout'
import ChangePwd from '../change/ChangePwd'

import { logout, fetchDeductions, fetchLpds } from 'actions'

const Main = ({ routes }) => {
	const dispatch = useDispatch()
	const auth = useSelector(state => state.auth && state.auth.data)
	const [openDialog, setOpenDialog] = useState(false)
	const [messageState, setMessageState] = useState()

	const handleCloseDialog = (message) => {
		if (message) {
			setMessageState(message)
		}
		if (!message || (message && message.type === 'success')) {
			setOpenDialog(false)
		}
	}

	useEffect(() => {
		dispatch(fetchDeductions())
		dispatch(fetchLpds())
	}, [dispatch])

	const handleMessageClose = () => setMessageState(null)

	const handleChangePassword = () => setOpenDialog(true)

	const handleLogout = async () => {
		await dispatch(logout())
		window.location.replace('/logout')
	}

	return (
		<>
			<MainLayout
				auth={auth}
				routes={routes}
				onChangePassword={handleChangePassword}
				onLogout={handleLogout}
			/>
			{openDialog && (
				<ChangePwd
					open={openDialog}
					onClose={handleCloseDialog}
				/>
			)}
			{(messageState) && (
				<Snackbar open={!!messageState} autoHideDuration={6000} onClose={handleMessageClose}>
					<Alert onClose={handleMessageClose} severity={messageState.type} variant="filled">
						{messageState.text}
					</Alert>
				</Snackbar>
			)}
		</>
	)
}
export default Main