import { useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'

import DwellingUnitList from 'components/DwellingUnitList'

import AddDwellingUnit from './AddDwellingUnit'
import EditDwellingUnit from './EditDwellingUnit'
import DeleteDwellingUnit from './DeleteDwellingUnit'

const DwellingUnits = ({
	mode,
	submit,
	projectId,
	isLoading,
	inProgress,
	onSubmit,
	onCancel
}) => {
	const project = useSelector(state => state.projects && state.projects.data &&
		projectId && state.projects.data.find(project => project.id === projectId))
	const dwellingUnits = (project && project['dwellingUnits']) ? project['dwellingUnits'] : []

	const actions = useMemo(() => [
		{ key: 'add-dwellingUnits', label: 'Add', icon: 'plus', element: AddDwellingUnit },
		{ key: 'edit-dwellingUnits', label: 'Edit', icon: 'pencil', element: EditDwellingUnit, disabled: (selection) => (selection.length !== 1), default: true },
		{ key: 'delete-dwellingUnits', label: 'Delete', icon: 'trash-can', element: DeleteDwellingUnit, disabled: (selection) => (selection.length === 0) }
	], [])

	useEffect(() => {
		if (submit) {
			onSubmit && onSubmit(true)
		}
	}, [submit, onSubmit])

	return (
		<DwellingUnitList
			context={{ id: project.id }}
			actions={actions}
			dwellingUnits={dwellingUnits}
			defaultAction={actions.find(item => item.default)}
		/>
	)
}

export default DwellingUnits