import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'

import MessageDialog from 'components/core/MessageDialog'
import { copyBuilding } from 'actions'
import { MSG_TYPE } from 'constants'

const CopyBuilding = ({
	selection,
    context,
	onClose
}) => {
	const dispatch = useDispatch()
    const buildingId = (selection && selection[0]) ? selection[0].id : null
	const [open, setOpen] = useState(true)
	const inProgress = useSelector(state => state.projects && state.projects.inProgress)

	const handleCancel = () => {
		setOpen(false)
		onClose && onClose()
	}

	const handleConfirm = async () => {
		const { error } = await dispatch(copyBuilding(context.id, buildingId))

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
				message: 'The building has been copied successfully'
			})
		}
	}

	return (
		<MessageDialog open={open}
			color="warning"
			title="Copy Building?"
			description="Selected building will be copied. You cannot undo this action once performed."
			confirmText="Copy Building"
			inProgress={inProgress}
			onCancel={handleCancel}
			onConfirm={handleConfirm}
		/>
	)
}

export default CopyBuilding