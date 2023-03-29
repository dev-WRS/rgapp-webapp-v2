import { useMemo } from 'react'
import { useTheme } from '@emotion/react'

import DataBrowser from 'components/core/DataBrowser'
import DataColumn from 'components/core/DataColumn'

const statusOptions = {
	inProgress: 'In Progress',
	readyForReview: 'Ready For Review',
	approved: 'Approved',
	closed: 'Closed',
}

const ProjectList = ({
	actions,
	projects,
	defaultAction,
	onRefresh,
	onActionClose
}) => {
	const theme = useTheme()

	const columns = useMemo(() => [
		{ label: 'Project ID', dataKey: 'projectID', dataType: 'string', disablePadding: false, render: undefined, filterable: true },
		{ label: 'Name', dataKey: 'name', dataType: 'string', disablePadding: false, render: undefined, filterable: true },
		{ label: 'Type', dataKey: 'reportType', dataType: 'string', disablePadding: false, render: undefined, filterable: true },
		{
			label: 'Status', dataKey: 'status', dataType: 'select', disablePadding: false,
			filterable: { options: Object.keys(statusOptions).map(value => ({ value, text: statusOptions[value] })) },
			calculate: ({ status }) => status,
			render: (row, column) => {
				const colors = { inProgress: theme.palette.report.inProgress, readyForReview: theme.palette.report.readyForReview, approved: theme.palette.report.approved, closed: theme.palette.report.closed }
				const value = column.calculate(row)
				const text = statusOptions[value] 
				return (
					value && (
						<DataColumn.Chip label={text} size="small"
							sx={{
								color: 'white',
								backgroundColor: colors[value],
								borderRadius: theme.spacing(0.5)
							}}
						/>
					)
				)
			}
		},
	], [theme])

	return (
		<DataBrowser
			actions={actions}
			columns={columns}
			rows={projects}
			defaultAction={defaultAction}
			onRefresh={onRefresh}
			onActionClose={onActionClose}
		/>
	)
}

export default ProjectList