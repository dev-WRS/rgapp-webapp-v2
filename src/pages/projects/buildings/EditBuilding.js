import { useSelector, useDispatch } from 'react-redux'

import BuildingForm from 'components/BuildingForm'
import { updateBuilding } from 'actions'
import { MSG_TYPE } from 'constants'

const EditBuilding = ({
	selection,
	context,
	onClose
}) => {
	const dispatch = useDispatch()
	const buildingId = (selection && selection[0]) ? selection[0].id : null
	const building = (selection && selection[0]) ? selection[0] : null
	const isLoading = useSelector(state => state.projects && state.projects.isLoading)
	const inProgress = useSelector(state => state.projects && state.projects.inProgress)

	const handleSubmit = async (state) => {
		const { error } = await dispatch(updateBuilding(context.id, buildingId, state))

		if (error) {
			onClose({
				type: MSG_TYPE.error,
				message: error.message
			})
		}
		else {
			onClose({
				type: MSG_TYPE.success,
				message: 'The building has been successfully updated'
			})
		}
	}

	const handleCancel = () => {
		onClose && onClose()
	}

	return (
		<BuildingForm
			open={true}
			record={building}
			context={context}
			isLoading={isLoading}
			inProgress={inProgress}
			onSubmit={handleSubmit}
			onCancel={handleCancel}
		/>
	)
}

export default EditBuilding