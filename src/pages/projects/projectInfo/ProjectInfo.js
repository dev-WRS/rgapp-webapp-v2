import { useSelector } from 'react-redux'

import ProjectInfoForm from 'components/ProjectInfoForm'

const ProjectInfo = ({
	mode,
	submit,
	projectId,
	originalProjectID,
	isLoading,
	inProgress,
	onSubmit,
	onCancel
}) => {
	const project = useSelector(state => state.projects && state.projects.data &&
		projectId && state.projects.data.find(project => project.id === projectId))

	return (
		<ProjectInfoForm
			mode={mode}
			record={project}
			submit={submit}
			isLoading={isLoading}
			inProgress={inProgress}
			onSubmit={onSubmit}
			onCancel={onCancel}
		/>
	)
}

export default ProjectInfo