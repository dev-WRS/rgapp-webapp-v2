import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'

import MessageDialog from 'components/core/MessageDialog'
import { deleteUser } from 'actions'
import { MSG_TYPE } from 'constants'

const DeleteUser = ({
	selection, 
	onClose	
}) => {
	const dispatch = useDispatch()
	const [open, setOpen] = useState(true)
	const inProgress = useSelector(state => state.users && state.users.inProgress)
	
	const handleCancel = () => {
		setOpen(false)
		onClose && onClose()	
	}

	const handleConfirm = async () => {
		const { error } = await dispatch(deleteUser(selection[0].id))

		setOpen(false)
		
		if (error) {
			onClose({
				type: MSG_TYPE.error,
				message: error.message
			})
		}
		else {
			onClose({
				type: MSG_TYPE.success,
				message: 'The user has been successfully deleted'
			})
		}
	}
	
	return (
		<MessageDialog open={open}
			color="error"
			title="Delete User?"
			description="Selected user will be permanently deleted. You cannot undo this action once performed."
			confirmText="Delete"
			inProgress={inProgress}
			onCancel={handleCancel}
			onConfirm={handleConfirm}
		/>
	)
}

export default DeleteUser