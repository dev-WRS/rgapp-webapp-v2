import { useMemo } from 'react';
import { useTheme } from '@emotion/react';

import DataBrowser from 'components/core/DataBrowser';

const stateOptions = {
  AL: 'Alabama',
  AK: 'Alaska',
  AZ: 'Arizona',
  AR: 'Arkansas',
  CA: 'California',
  CO: 'Colorado',
  CT: 'Connecticut',
  DE: 'Delaware',
  FL: 'Florida',
  GA: 'Georgia',
  HI: 'Hawaii',
  ID: 'Idaho',
  IL: 'Illinois',
  IN: 'Indiana',
  IA: 'Iowa',
  KS: 'Kansas',
  KY: 'Kentucky',
  LA: 'Louisiana',
  ME: 'Maine',
  MD: 'Maryland',
  MA: 'Massachusetts',
  MI: 'Michigan',
  MN: 'Minnesota',
  MS: 'Mississippi',
  MO: 'Missouri',
  MT: 'Montana',
  NE: 'Nebraska',
  NV: 'Nevada',
  NH: 'New Hampshire',
  NJ: 'New Jersey',
  NM: 'New Mexico',
  NY: 'New York',
  NC: 'North Carolina',
  ND: 'North Dakota',
  OH: 'Ohio',
  OK: 'Oklahoma',
  OR: 'Oregon',
  PA: 'Pennsylvania',
  RI: 'Rhode Island',
  SC: 'South Carolina',
  SD: 'South Dakota',
  TN: 'Tennessee',
  TX: 'Texas',
  UT: 'Utah',
  VT: 'Vermont',
  VA: 'Virginia',
  WA: 'Washington',
  WV: 'West Virginia',
  WI: 'Wisconsin',
  WY: 'Wyoming',
};

const privateProjectOptions = {
	true: 'Private',
	false: 'Public',
}

const CertifiedBuildingsList = ({
	actions,
	certifiedBuildings,
	defaultAction,
	onRefresh,
	onActionClose,
	isLoading,
	dialogOpened,
	onFilteredBuildings
}) => {
	const theme = useTheme();

	const columns = useMemo(
	() => [
		{
			label: 'Project Id',
			dataKey: 'projectId',
			dataType: 'string',
			disablePadding: false,
			render: undefined,
			filterable: true,
			searchable: true
		},
		{
			label: 'Project Name',
			dataKey: 'projectName',
			dataType: 'string',
			disablePadding: false,
			render: undefined,
			filterable: true,
			searchable: true
		},
		{
			label: 'Private',
			dataKey: 'privateProject',
			dataType: 'select',
			disablePadding: false,
			render: undefined,
			filterable: true,
			searchable: true,
			calculate: ({ privateProject }) => privateProject,
				render: (row, column) => {
					const value = column.calculate(row)
					return privateProjectOptions[value]
			},
			filterable: {
				options: [
					{ value: 'true', text: 'Private' },
					{ value: 'false', text: 'Public' }
				],
			},
		},
		{
			label: 'Tax Year',
			dataKey: 'taxYear',
			dataType: 'string',
			disablePadding: false,
			render: undefined,
			filterable: true,
			searchable: true
		},
		{
			label: 'Building Name',
			dataKey: 'buildingName',
			dataType: 'string',
			disablePadding: false,
			render: undefined,
			filterable: true,
			searchable: true
		},
		{
			label: 'Address',
			dataKey: 'address',
			dataType: 'string',
			disablePadding: false,
			render: undefined,
			filterable: true,
			searchable: true
		},
		{
			label: 'State',
			dataKey: 'state',
			dataType: 'select',
			searchable: true,
			disablePadding: false,
			calculate: ({ state }) => state,
				render: (row, column) => {
					const value = column.calculate(row)
					const text = stateOptions[value] 
					return text
				},
			filterable: { options: Object.keys(stateOptions).map(value => ({ value, text: stateOptions[value] })) },
		},
		{
			label: 'Client',
			dataKey: 'customer',
			dataType: 'string',
			disablePadding: false,
			render: undefined,
			filterable: true,
			searchable: true
		},
	],
	[theme]
	);

	return (
		<DataBrowser
			actions={actions}
			columns={columns}
			rows={certifiedBuildings}
			defaultAction={defaultAction}
			onRefresh={onRefresh}
			onActionClose={onActionClose}
			isLoading={isLoading}
			dialogOpened={dialogOpened}
			origin={'certifiedBuildings'}
			onFilteredRowsChange={onFilteredBuildings}
		/>
	);
};

export default CertifiedBuildingsList;
