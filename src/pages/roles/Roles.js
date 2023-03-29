import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import checkPermission from 'check-permission'

import DataBrowser from 'components/core/DataBrowser'

import EditRole from './EditRole'

const Roles = () => {
	const permissions = useSelector(state => state.permissions && state.permissions.data)
	const roles = useSelector(state => state.roles && state.roles.data)
	const actions = useMemo(() => [
		{ key: 'edit-roles', label: 'Edit', icon: 'pencil', element: EditRole, disabled: (selection) => (selection.length !== 1), default: true }
	], [])
	const columns = useMemo(() => [
		{ label: 'Role', dataKey: 'name', dataType: 'string', disablePadding: false, render: undefined },
		{ label: 'Description', dataKey: 'description', dataType: 'string', disablePadding: false, render: undefined },
		{ label: 'Users', dataKey: 'users', dataType: 'number', disablePadding: false, render: (row, column) => {
			return `${row[column.dataKey] || 0} user(s)`
		} }
	], [])

	return (
		<DataBrowser
			actions={actions.filter(item => 
				checkPermission(item, permissions))}
			columns={columns}
			rows={roles}
			defaultAction={actions.find(item => item.default)}
		/>
	)
}

export default Roles