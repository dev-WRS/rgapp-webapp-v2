import SelectField from 'components/core/SelectField'

const SelectPhotoDescriptionField = (props) => {
	return (
		<SelectField
			options={[
				{ 'label': 'Partial elevation', 'value': 'Partial elevation' },
				{ 'label': 'Lighting fixture', 'value': 'Lighting fixture' },
				{ 'label': 'Lighting control', 'value': 'Lighting control' },
				{ 'label': 'HVAC system', 'value': 'HVAC system' },
				{ 'label': 'HVAC control', 'value': 'HVAC control' },
				{ 'label': 'Envelope system', 'value': 'Envelope system' },
				{ 'label': 'Typical energy efficient fixture', 'value': 'Typical energy efficient fixture' },
				{ 'label': 'Typical energy efficient thermostat', 'value': 'Typical energy efficient thermostat' },
				{ 'label': 'Typical energy efficient air handler unit', 'value': 'Typical energy efficient air handler unit' },
				{ 'label': 'Typical energy efficient condensing unit', 'value': 'Typical energy efficient condensing unit' },
				{ 'label': 'Typical energy efficient water heater', 'value': 'Typical energy efficient water heater' },
			]}
			MenuProps={{
				style: {
					maxHeight: 48 * 4.5
				}
			}}
			valueProp="value"
			textProp="value"
			{...props}
		/>
	)
}

export default SelectPhotoDescriptionField