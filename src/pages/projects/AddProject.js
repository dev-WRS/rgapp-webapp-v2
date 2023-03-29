import { useSelector, useDispatch } from 'react-redux'

import ProjectStepper from 'components/ProjectStepper'
import { createProject } from 'actions'
import { MSG_TYPE } from 'constants'

const AddProject = ({
	onClose
}) => {
	const dispatch = useDispatch()
	const inProgress = useSelector(state => state.projects && state.projects.inProgress)

	const handleSubmit = async (state) => {
		const data = new FormData()

		Object.keys(state).forEach(name => data.append(name, state[name]))

		const { error } = await dispatch(createProject(data))

		if (error) {
			onClose({
				type: MSG_TYPE.error,
				message: error.message
			})
		}
		else {
			onClose({
				type: MSG_TYPE.success,
				message: 'The project has been successfully created'
			})
		}
	}

	const handleCancel = () => {
		onClose && onClose()
	}

	return (
		<ProjectStepper
			open={true}
			inProgress={inProgress}
			onSubmit={handleSubmit}
			onCancel={handleCancel}
		/>
	)
}

export default AddProject