import { useState, useEffect } from 'react'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Alert from '@mui/material/Alert'

import useForm from 'hooks/useForm'
import TextField from 'components/core/TextField'
import Button from 'components/core/Button'
import LoadingButton from 'components/core/LoadingButton'
import Snackbar from 'components/core/Snackbar'

const validations = { 
	email: ['required', 'email']
}

const ForgotPwdForm = ({ 
	error,
	isLoading,
	onSubmit,
	onCancel 
}) => {
	const [openErrorMsg, setOpenErrorMsg] = useState(false)
	const { state, formValidate, getError, onValueChange, onBlur } = useForm({ initialState: { email: '' }, validations })

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
					Enter your email to receive the information to reset your password.
				</Typography>
				<Box>
					<TextField id="email" label="Email"
						fullWidth
						size="medium"
						disabled={isLoading}
						value={state.email}
						autoFocus
						onChange={onValueChange}
						onBlur={onBlur}
						{...getError('email')}
					/>
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
						>Send</LoadingButton>
					</Stack>
				</Box>
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

export default ForgotPwdForm