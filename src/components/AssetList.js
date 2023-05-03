import { useMemo } from 'react'
import { useTheme } from '@emotion/react'

import DataBrowser from 'components/core/DataBrowser'
import DataColumn from 'components/core/DataColumn'
import { DISPLAY_DATE_TIME_FORMAT } from 'constants'
import { sizeFormat, dateFormat } from 'helpers'

const originOptions = {
	customer: 'Customer',
	certifier: 'Certifier',
	project: 'Project'
}

const AssetList = ({
	actions,
	assets,
	defaultAction,
	onRefresh,
	onActionClose,
	isLoading
}) => {
	const theme = useTheme()
	const columns = useMemo(() => [
		{ label: 'Name', dataKey: 'name', dataType: 'string', disablePadding: false, render: undefined, searchable: true, filterable: false },
		{ label: 'Format', dataKey: 'format', dataType: 'string', disablePadding: false, render: undefined, filterable: true },
		{ label: 'Size', dataKey: 'size', dataType: 'number', disablePadding: false, format: (value) => sizeFormat(value), filterable: false },
		{ label: 'Origin', dataKey: 'origin', dataType: 'select', disablePadding: false,
			filterable: { options: Object.keys(originOptions).map(value => ({ value, text: originOptions[value] })) },
			calculate: ({ origin }) => origin,
			render: (row, column) => {
				const colors = { customer: theme.palette.brand.customer, certifier: theme.palette.brand.certifier, project: theme.palette.brand.project }
				const value = column.calculate(row)
				const text = originOptions[value]
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
		{ label: 'Created at', dataKey: 'createDate', dataType: 'datetime', disablePadding: false, format: (value) => dateFormat(value, DISPLAY_DATE_TIME_FORMAT), filterable: true }
	], [theme])

	return (
		<DataBrowser
			actions={actions}
			columns={columns}
			rows={assets}
			multiSelect={true}
			defaultAction={defaultAction}
			onRefresh={onRefresh}
			onActionClose={onActionClose}
			isLoading={isLoading}
		/>
	)
}

export default AssetList