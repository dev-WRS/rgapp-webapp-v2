import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'

import MessageDialog from 'components/core/MessageDialog'
import { deleteAsset } from 'actions'
import { MSG_TYPE } from 'constants'

const DeleteAsset = ({
	selection, 
	onClose	
}) => {
	const dispatch = useDispatch()
	const [open, setOpen] = useState(true)
	const inProgress = useSelector(state => state.assets && state.assets.inProgress)
	
	const handleCancel = () => {
		setOpen(false)
		onClose && onClose()	
	}

	const handleConfirm = async () => {
		const { payload } = await dispatch(deleteAsset(selection.map(element => { return {id: element.id}})))
		const warning = payload.find(item => item.warningMessage)

		setOpen(false)

		if (warning) {
			onClose({
				type: MSG_TYPE.warning,
				message: warning.warningMessage
			})
		}
		else {
			onClose({
				type: MSG_TYPE.success,
				message: 'The asset(s) has been successfully deleted'
			})
		}
	}
	
	return (
		<MessageDialog open={open}
			color="error"
			title="Delete Asset?"
			description="Selected asset will be permanently deleted. You cannot undo this action once performed."
			confirmText="Delete"
			inProgress={inProgress}
			onCancel={handleCancel}
			onConfirm={handleConfirm}
		/>
	)
}

export default DeleteAsset