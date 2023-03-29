import { useSelector, useDispatch } from 'react-redux'

import BuildingForm from 'components/BuildingForm'
import { createBuilding } from 'actions'
import { MSG_TYPE } from 'constants'

const AddBuilding = ({
	context,
	onClose
}) => {
	const dispatch = useDispatch()
	const inProgress = useSelector(state => state.projects && state.projects.inProgress)

	const handleSubmit = async (state) => {
		const { error } = await dispatch(createBuilding(context.id, [state]))

		if (error) {
			onClose({
				type: MSG_TYPE.error,
				message: error.message
			})
		}
		else {
			onClose({
				type: MSG_TYPE.success,
				message: 'The building has been successfully created'
			})
		}
	}

	const handleCancel = () => {
		onClose && onClose()
	}

	return (
		<BuildingForm
			open={true}
			context={context}
			inProgress={inProgress}
			onSubmit={handleSubmit}
			onCancel={handleCancel}
		/>
	)
}

export default AddBuilding