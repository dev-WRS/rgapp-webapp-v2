import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'

import MessageDialog from 'components/core/MessageDialog'
import { deleteDwellingUnit } from 'actions'
import { MSG_TYPE } from 'constants'

const DeleteDwellingUnit = ({
	selection, 
	context,
	onClose	
}) => {
	const dispatch = useDispatch()
	const [open, setOpen] = useState(true)
	const inProgress = useSelector(state => state.projects && state.projects.inProgress)
	
	const handleCancel = () => {
		setOpen(false)
		onClose && onClose()	
	}

	const handleConfirm = async () => {
		const { error } = await dispatch(deleteDwellingUnit(context.id, selection.map(element => { return {id: element.id}})))

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
				message: 'The dwelling unit(s) has been successfully deleted'
			})
		}
	}
	
	return (
		<MessageDialog open={open}
			color="error"
			title="Delete Dwelling Unit(s)?"
			description="Selected dwelling unit(s) will be permanently deleted. You cannot undo this action once performed."
			confirmText="Delete"
			inProgress={inProgress}
			onCancel={handleCancel}
			onConfirm={handleConfirm}
		/>
	)
}

export default DeleteDwellingUnit