import { useSelector, useDispatch } from 'react-redux'

import DwellingUnitForm from 'components/DwellingUnitForm'
import { updateDwellingUnit } from 'actions'
import { MSG_TYPE } from 'constants'

const EditDwellingUnit = ({
	selection,
	context,
	onClose
}) => {
	const dispatch = useDispatch()
	const dwellingUnitId = (selection && selection[0]) ? selection[0].id : null
	const dwellingUnit = (selection && selection[0]) ? selection[0] : null
	const isLoading = useSelector(state => state.projects && state.projects.isLoading)
	const inProgress = useSelector(state => state.projects && state.projects.inProgress)

	const handleSubmit = async (state) => {
		const { error } = await dispatch(updateDwellingUnit(context.id, dwellingUnitId, state))

		if (error) {
			onClose({
				type: MSG_TYPE.error,
				message: error.message
			})
		}
		else {
			onClose({
				type: MSG_TYPE.success,
				message: 'The dwelling unit has been successfully updated'
			})
		}
	}

	const handleCancel = () => {
		onClose && onClose()
	}

	return (
		<DwellingUnitForm
			record={dwellingUnit}
			open={true}
			isLoading={isLoading}
			inProgress={inProgress}
			onSubmit={handleSubmit}
			onCancel={handleCancel}
		/>
	)
}

export default EditDwellingUnit