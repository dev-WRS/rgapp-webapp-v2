import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogActions from '@mui/material/DialogActions'

import Button from 'components/core/Button'

const MessageDialog = ({
	color,
	title,
	description,
	confirmText, 
	open,
	inProgress,
	onCancel,
	onConfirm
}) => {
	return (
		<Dialog open={open} maxWidth={'xs'}>
			<DialogTitle>{title}</DialogTitle>
			<DialogContent>
				<DialogContentText>
					{description}
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={onCancel} variant="outlined" color="cancel" disabled={inProgress}>Cancel</Button>
				<Button onClick={onConfirm} variant="contained" color={color} disabled={inProgress}
					sx={{ color: "white" }}
				>{confirmText}</Button>
			</DialogActions>
		</Dialog>
	)
}

export default MessageDialog