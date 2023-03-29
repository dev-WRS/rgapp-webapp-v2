import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import useForm from 'hooks/useForm'
import TextField from 'components/core/TextField'

import Button from 'components/core/Button'
import LoadingButton from 'components/core/LoadingButton'
import { useTheme } from '@emotion/react'

const validations = {
	password: ['required'],
	newPassword: ['required',
		{ type: 'minLength', value: 7 },
		'hasUpperCase', 'hasLowerCase', 'hasNumber', 'hasSpecialCharacter'
	],
	confirmPassword: ['required', { type: 'match', name: 'newPassword', message: 'The new password and confirm password fields differ' }]
}

const ChangePwdForm = ({
	open,
	// onClose, 
	isLoading, 
	onSubmit,
	onCancel
}) => {
	const theme = useTheme()
	const { state, formValidate, getError, onValueChange, onBlur } = useForm({ initialState: { password: '', newPassword: '', confirmPassword: '' }, validations })

	const handleSubmit = event => {
		event.preventDefault()
		if (onSubmit && formValidate()) {
			onSubmit(state)
		}
	}

	return (
		<Dialog open={open}/* onClose={onClose}*/>
			<form autoComplete="off" noValidate onSubmit={handleSubmit}>
				<DialogTitle>Change Password</DialogTitle>
				<DialogContent sx={{
					padding: '0px 24px',
					width: 400
				}}>
					<Box sx={{
						pt: 1
					}}>
						<TextField type="password" id="password" label="Current Password"
							fullWidth
							size="medium"
							disabled={isLoading}
							onChange={onValueChange}
							onBlur={onBlur}
							{...getError('password')}
						/>
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
				</DialogContent>
				<DialogActions sx={{
					paddingLeft: 3,
					paddingRight: 3,
					paddingBottom: 3 
				}}>
					<Button variant="outlined" onClick={onCancel}
						disabled={isLoading} 
						color="cancel"
						sx={{
							flex: 1
						}}
					>Cancel</Button>
					<LoadingButton type="submit" variant="contained" color="secondary"
						disabled={isLoading}
						loading={isLoading}
						sx={{
							color: 'white',
							flex: 1
						}}
					>Submit</LoadingButton>
				</DialogActions>
			</form>
		</Dialog>
	)
}

export default ChangePwdForm