import { useMemo } from 'react'
import { useTheme } from '@emotion/react'

import DataBrowser from 'components/core/DataBrowser'
import DataColumn from 'components/core/DataColumn'

const CustomerList = ({
	actions,
	customers,
	defaultAction,
	onRefresh,
	onActionClose,
	isLoading
}) => {
	const theme = useTheme()

	const columns = useMemo(() => [
		{ label: 'Name', dataKey: 'name', dataType: 'string', disablePadding: false, render: undefined, filterable: true },
		{ label: 'Address', dataKey: 'address', dataType: 'string', disablePadding: false, render: undefined, filterable: true },
		{ label: 'Phone', dataKey: 'phone', dataType: 'string', disablePadding: false, filterable: true, searchable: true,
			render: (row, column) => (<DataColumn.Phone sx={{ color: theme.palette.text.primary }} href={row[column.dataKey]} size="small"/>)
		}
	], [theme])

	return (
		<DataBrowser
			actions={actions}
			columns={columns}
			rows={customers}
			defaultAction={defaultAction}
			onRefresh={onRefresh}
			onActionClose={onActionClose}
			isLoading={isLoading}
		/>
	)
}

export default CustomerList