import { useState } from 'react'

import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import Select from '@mui/material/Select'
import Checkbox from '@mui/material/Checkbox'

const SelectField = ({
	id,
	name,
	label,
	fullWidth,
	size,
	valueProp = 'value',
	textProp = 'text',
	disabled,
	value,
	options = [],
	error,
	helperText,
	onChange,
	onBlur,
	sx,
	MenuProps = {}
}) => {
	const [itemValue, setItemValue] = useState(value || []);

	const handleChange = (event) => {
		const { target: { value } } = event;

		event.target.id = id
		event.target.name = name
		onChange && onChange(event)

		setItemValue(
			// On autofill we get a stringified value.
			typeof value === 'string' ? value.split(',') : value,
		);
	}

	return (
		<FormControl fullWidth={fullWidth} size={size} disabled={disabled} error={error}
			sx={{
				//mt: 0.5,
				pb: helperText ? 0 : 3,
				...sx
			}}
		>
			<InputLabel id={`${id}-label`}>{label}</InputLabel>
			<Select
				multiple
				labelId={`${id}-label`}
				id={id}
				value={itemValue}
				label={label}
				onChange={handleChange}
				onBlur={onBlur}
				renderValue={(selected) => selected.join(', ')}
				MenuProps={MenuProps}
			>
				{options.map((option, index) => (
					<MenuItem key={`${option[valueProp]}-${index}`}
						value={option[valueProp]}
					>
						<Checkbox checked={itemValue.indexOf(option[valueProp]) > -1} />
						{option[valueProp]}
					</MenuItem>
				))}
			</Select>
			<FormHelperText>{helperText}</FormHelperText>
		</FormControl>
	)
}

export default SelectField