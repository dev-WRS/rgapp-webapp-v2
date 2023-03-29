import { useState } from 'react'
import { useDispatch } from 'react-redux'

import MessageDialog from 'components/core/MessageDialog'
import { deactivateUser } from 'actions'
import { MSG_TYPE } from 'constants'

const DeactivateUser = ({
	selection, 
	onClose	
}) => {
	const dispatch = useDispatch()
	const [open, setOpen] = useState(true)
	
	const handleCancel = () => {
		setOpen(false)
		onClose && onClose()	
	}

	const handleConfirm = async () => {
		const { error } = await dispatch(deactivateUser(selection[0].id))

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
				message: 'The user has been successfully deactivated'
			})
		}
	}
	
	return (
		<MessageDialog open={open}
			color="secondary"
			title="Deactivate User?"
			description="Selected user won’t be able to login and use the system again until activated."
			confirmText="Deactivate"
			onCancel={handleCancel}
			onConfirm={handleConfirm}
		/>
	)
}

export default DeactivateUser