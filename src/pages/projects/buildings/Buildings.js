import { useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'

import BuildingList from 'components/BuildingList'

import AddBuilding from './AddBuilding'
import CopyBuilding from './CopyBuilding'
import EditBuilding from './EditBuilding'
import DeleteBuilding from './DeleteBuilding'

const Buildings = ({
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
	const buildings = (project && project['buildings']) ? project['buildings'] : []

	const actions = useMemo(() => [
		{ key: 'add-buildings', label: 'Add', icon: 'plus', element: AddBuilding },
		{ key: 'copy-buildings', label: 'Copy', icon: 'copy', element: CopyBuilding, disabled: (selection) => (selection.length !== 1), default: false },
		{ key: 'edit-buildings', label: 'Edit', icon: 'pencil', element: EditBuilding, disabled: (selection) => (selection.length !== 1), default: true },
		{ key: 'delete-buildings', label: 'Delete', icon: 'trash-can', element: DeleteBuilding, disabled: (selection) => (selection.length === 0) }
	], [])

	useEffect(() => {
		if (submit) {
			onSubmit && onSubmit(true)
		}
	}, [submit, onSubmit])

	return (
		<BuildingList
			context={{ id: project.id, taxYear: project.taxYear, buildingDefaults: project.buildingDefaults }}
			actions={actions}
			buildings={buildings}
			defaultAction={actions.find(item => item.default)}
		/>
	)
}

export default Buildings