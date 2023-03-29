import { useMemo } from 'react'
import { useTheme } from '@emotion/react'

import DataBrowser from 'components/core/DataBrowser'
import DataColumn from 'components/core/DataColumn'

const statusOptions = {
	active: 'Active',
	inactive: 'Inactive',
	invited: 'Invited'
}

const UserList = ({
	actions,
	roles,
	users,
	defaultAction,
	onRefresh,
	onActionClose
}) => {
	const theme = useTheme()
	const columns = useMemo(() => [
		{ label: 'Name', dataKey: 'name', dataType: 'string', disablePadding: false, render: undefined, filterable: true, searchable: true },
		{ label: 'Email', dataKey: 'email', dataType: 'string', disablePadding: false, render: undefined, filterable: true, searchable: true },
		{ label: 'Phone', dataKey: 'phone', dataType: 'string', disablePadding: false, filterable: true, searchable: true,
			render: (row, column) => (<DataColumn.Phone sx={{ color: theme.palette.text.primary }} href={row[column.dataKey]} size="small"/>)
		},
		{ label: 'Role', dataKey: 'role', dataType: 'select', disablePadding: false, 
			filterable: { options: roles.map(({ id, name }) => ({ text: name, value: id })) },
			calculate: ({ role }) => (role && role.id),
			render: ({ role }) => (role ? role.name : '')
		},
		{ label: 'Status', dataKey: 'status', dataType: 'select', disablePadding: false,
			filterable: { options: Object.keys(statusOptions).map(value => ({ value, text: statusOptions[value] })) },
			calculate: ({ emailVerified, active }) => (!emailVerified ? 'invited' : active ? 'active' : 'inactive'),
			render: (row, column) => {
				const colors = { active: theme.palette.secondary.main, inactive: theme.palette.brand.gray, invited: theme.palette.brand.orange }
				const value = column.calculate(row)
				const text = statusOptions[value]
				return (
					<DataColumn.Chip label={text} size="small"
						sx={{
							color: 'white', 
							backgroundColor: colors[value],
							borderRadius: theme.spacing(0.5)
						}}
					/>
				)
			} 
		}
	], [theme, roles])

	return (
		<DataBrowser
			actions={actions}
			columns={columns}
			rows={users}
			defaultAction={defaultAction}
			onRefresh={onRefresh}
			onActionClose={onActionClose}
		/>
	)
}

export default UserList