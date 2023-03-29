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
	email: ['required', 'email'],
	password: ['required']
}

const LoginForm = ({ 
	error, 
	isLoading, 
	onSubmit,
	onForgotPwd 
}) => {
	const [openErrorMsg, setOpenErrorMsg] = useState(false)
	const { state, formValidate, getError, onValueChange, onBlur } = useForm({ initialState: { email: '', password: '' }, validations })

	useEffect(() => {
		setOpenErrorMsg(error ? true : false)	
	}, [error])

	const handleErrorMsgClose = () => setOpenErrorMsg(false)

	const handleForgotPwd = () => {
		if (onForgotPwd) {
			onForgotPwd(state)
		}
	}

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
					Welcome back! Please login to your account.
				</Typography>
				<Box>
					<TextField id="email" label="Email" disabled={isLoading}
						fullWidth
						size={'medium'}
						value={state.email}
						autoFocus
						onChange={onValueChange}
						onBlur={onBlur}
						{...getError('email')}
					/>
					<TextField type="password" id="password" label="Password" disabled={isLoading}
						fullWidth
						size={'medium'}
						onChange={onValueChange}
						onBlur={onBlur}
						{...getError('password')}
					/>
				</Box>
				<Stack
					direction="row"
					justifyContent="flex-end"
					alignItems="center"
				>
					<Box flex={1}>
						<Button flex={1} onClick={handleForgotPwd} disabled={isLoading}
							size="small"
							sx={{
								fontSize: '12px',
								float: 'right',
								textTransform: 'none'
							}}>Forgot Password
						</Button>
					</Box>
				</Stack>
				<Stack
					direction="row"
					alignItems="center" 
					sx={{
						mt: 4
					}}
				>
					<LoadingButton type="submit" variant="contained"
						fullWidth
						size="large"
						disabled={isLoading}
						loading={isLoading}
					>Login</LoadingButton>
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

export default LoginForm