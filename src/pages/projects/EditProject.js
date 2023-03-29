import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import ProjectStepper from 'components/ProjectStepper'
import { fetchProject, updateProject } from 'actions'
import { MSG_TYPE } from 'constants'

const EditProject = ({
	selection,
	onClose
}) => {
	const dispatch = useDispatch()
	const projectId = (selection && selection[0]) ? selection[0].id : null
	// const project = useSelector(state => state.projects && state.projects.data &&
	// 	projectId && state.projects.data.find(project => project.id === projectId))
	const isLoading = useSelector(state => state.projects && state.projects.isLoading)
	const inProgress = useSelector(state => state.projects && state.projects.inProgress)

	useEffect(() => {
		if (projectId) {
			dispatch(fetchProject(projectId))
		}
	}, [projectId, dispatch])

	const handleSubmit = async (state) => {
		const data = new FormData()

		Object.keys(state).forEach(name => data.append(name, state[name]))

		const { error } = await dispatch(updateProject(projectId, data))

		if (error) {
			onClose({
				type: MSG_TYPE.error,
				message: error.message
			})
		}
		else {
			onClose({
				type: MSG_TYPE.success,
				message: 'The project has been successfully updated'
			})
		}
	}

	const handleCancel = () => {
		onClose && onClose()
	}

	return (
		<ProjectStepper
			selection={selection}
			open={true}
			isLoading={isLoading}
			inProgress={inProgress}
			onSubmit={handleSubmit}
			onCancel={handleCancel}
		/>
	)
}

export default EditProject