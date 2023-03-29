import { useState, useEffect } from 'react'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Alert from '@mui/material/Alert'

import useForm from 'hooks/useForm'
import Button from 'components/core/Button'
import TextField from 'components/core/TextField'
import LoadingButton from 'components/core/LoadingButton'
import Snackbar from 'components/core/Snackbar'

const validations = {
	newPassword: ['required',
		{ type: 'minLength', value: 7 },
		'hasUpperCase', 'hasLowerCase', 'hasNumber', 'hasSpecialCharacter'
	],
	confirmPassword: ['required', { type: 'match', name: 'newPassword', message: 'The new password and confirm password fields differ' }]
}

const ResetPwdForm = ({
	error, 
	isLoading, 
	onSubmit,
	onCancel
}) => {
	const [openErrorMsg, setOpenErrorMsg] = useState(false)
	const { state, formValidate, getError, onValueChange, onBlur } = useForm({ initialState: { newPassword: '', confirmPassword: '' }, validations })

	useEffect(() => {
		setOpenErrorMsg(error ? true : false)	
	}, [error])

	const handleErrorMsgClose = () => setOpenErrorMsg(false)

	const handleSubmit = event => {
		event.preventDefault()
		if (onSubmit && formValidate()) {
			onSubmit(state)
		}
	}

	return (
		<form autoComplete="off" noValidate onSubmit={handleSubmit}>
			<Box sx={{
				p: 5,
				width: 420
			}}>
				<Typography align="center" sx={{
					color: 'secondary.main',
					fontSize: '30px',
					lineHeight: '17px',
					fontWeight: 'bold',
					letterSpacing: '6px',
					textTransform: 'uppercase',
					mb: 1.5
				}}>
					RepGenx
				</Typography>
				<Typography align="center" sx={{
					fontSize: '16px',
					lineHeight: '20px',
					mb: 6
				}}>
					Enter a new password to access your account.
				</Typography>
				<Box sx={{
					mb: 4
				}}>
					<TextField type="password" id="newPassword" label="New Password"
						fullWidth
						size="medium"
						disabled={isLoading}
						onChange={onValueChange}
						onBlur={onBlur}
						{...getError('newPassword')}
					/>
					<TextField type="password" id="confirmPassword" label="Confirm Password" 
						fullWidth
						size="medium"
						disabled={isLoading}
						onChange={onValueChange}
						onBlur={onBlur}
						{...getError('confirmPassword')}
					/>
				</Box>
				<Stack
					direction="row"
					justifyContent="center"
					alignItems="center"
					spacing={2}
					sx={{
						mt: 4
					}}
				>
					<Button variant="outlined"
						fullWidth
						size="large"
						disabled={isLoading}
						onClick={onCancel}
					>Cancel</Button>
					<LoadingButton type="submit" variant="contained"
						fullWidth
						size="large"
						disabled={isLoading}
						loading={isLoading}
					>Submit</LoadingButton>
				</Stack>
			</Box>
			{(openErrorMsg) && (
				<Snackbar open={openErrorMsg} autoHideDuration={6000} onClose={handleErrorMsgClose}>
					<Alert onClose={handleErrorMsgClose} severity="error" variant="filled">
						{error.message}
					</Alert>
				</Snackbar>
			)}
		</form>
	)
}

export default ResetPwdForm