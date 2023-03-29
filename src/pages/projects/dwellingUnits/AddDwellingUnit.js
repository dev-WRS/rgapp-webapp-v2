import { useSelector, useDispatch } from 'react-redux'

import DwellingUnitForm from 'components/DwellingUnitForm'
import { createDwellingUnit } from 'actions'
import { MSG_TYPE } from 'constants'

const AddDwellingUnit = ({
	context,
	onClose
}) => {
	const dispatch = useDispatch()
	const inProgress = useSelector(state => state.projects && state.projects.inProgress)

	const handleSubmit = async (state) => {
		const { error } = await dispatch(createDwellingUnit(context.id, [state]))

		if (error) {
			onClose({
				type: MSG_TYPE.error,
				message: error.message
			})
		}
		else {
			onClose({
				type: MSG_TYPE.success,
				message: 'The dwelling unit has been successfully created'
			})
		}
	}

	const handleCancel = () => {
		onClose && onClose()
	}

	return (
		<DwellingUnitForm
			open={true}
			inProgress={inProgress}
			onSubmit={handleSubmit}
			onCancel={handleCancel}
		/>
	)
}

export default AddDwellingUnit