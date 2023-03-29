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

const codeRegex = new RegExp('^[0-9]{0,}$')

const validations = { 
	code: ['required']
}

const severity = (type) => (type === 'success' || type === 'error') ? type : 'info'

const EmailVerifyForm = ({
	message, 
	isLoading,
	onResendCode, 
	onSubmit,
	onCancel
}) => {
	const [openMsg, setOpenMsg] = useState(false)
	const { state, formValidate, getError, onValueChange, onBlur } = useForm({ initialState: { code: '' }, validations })

	useEffect(() => {
		setOpenMsg(message ? true : false)	
	}, [message])

	const handleMsgClose = () => setOpenMsg(false)

	const handleCodeValueChange  = (event) => {
		const { id, value } = event.target

		if (codeRegex.test(value)) onValueChange({ target: { id, value } })
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
					Enter the security code we sent you via email to continue.
				</Typography>
				<Box>
					<TextField id="code" label="Security Code"
						fullWidth
						size="medium"
						disabled={isLoading}
						value={state.code}
						autoFocus
						onChange={handleCodeValueChange}
						onBlur={onBlur}
						{...getError('code')}
					/>
				</Box>
				<Stack
					direction="row"
					justifyContent="flex-end"
					alignItems="center"
				>
					<Box flex={1}>
						<Button flex={1} onClick={onResendCode} disabled={isLoading}
							size="small"
							sx={{
								fontSize: '12px',
								float: 'right',
								textTransform: 'none'
							}}>Resend Code
						</Button>
					</Box>
				</Stack>
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
			{(openMsg) && (
				<Snackbar open={openMsg} autoHideDuration={6000} onClose={handleMsgClose}>
					<Alert onClose={handleMsgClose} severity={severity(message.type)} variant="filled">
						{message.text}
					</Alert>
				</Snackbar>
			)}
		</form>
	)
}

export default EmailVerifyForm