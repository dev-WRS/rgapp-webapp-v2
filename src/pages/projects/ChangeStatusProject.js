import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import ProjectStatusChangeForm from 'components/ProjectStatusChangeForm'
import { fetchProject, updateProjectStatus } from 'actions'
import { MSG_TYPE } from 'constants'

const ChangeStatusProject = ({
	selection,
	onClose
}) => {
	const dispatch = useDispatch()
	const projectId = (selection && selection[0]) ? selection[0].id : null
	const project = useSelector(state => state.projects && state.projects.data && 
		projectId && state.projects.data.find(project => project.id === projectId))
	const isLoading = useSelector(state => state.projects && state.projects.isLoading)
	const inProgress = useSelector(state => state.projects && state.projects.inProgress)

	useEffect(() => {
		if (projectId) {
			dispatch(fetchProject(projectId))
		}
	}, [projectId, dispatch])

	const handleSubmit = async (state) => {
		const { error } = await dispatch(updateProjectStatus(projectId, state))

		if (error) {
			onClose({
				type: MSG_TYPE.error,
				message: error.message
			})
		}
		else {
			onClose({
				type: MSG_TYPE.success,
				message: 'The project status has been successfully updated'
			})
		}
	}

	const handleCancel = () => {
		onClose && onClose()
	}

	return (
		<ProjectStatusChangeForm
			record={project}
			open={true}
			isLoading={isLoading}
			inProgress={inProgress}
			onSubmit={handleSubmit}
			onCancel={handleCancel}
		/>
	)
}

export default ChangeStatusProject