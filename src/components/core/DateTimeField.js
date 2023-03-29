
import { useState } from 'react'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'

import TextField from 'components/core/TextField'

const DateTimeField = ({ label, value, onChange, ...props }) => {
	const [dateValue, setDateValue] = useState(value)

	const handleChange = (newValue) => {
		setDateValue(newValue)
		onChange && onChange({
			target: { value: newValue }
		})	
	}
	return (
		<LocalizationProvider dateAdapter={AdapterMoment}>
			<DateTimePicker
				label={label}
				value={dateValue}
				onChange={handleChange}
				renderInput={(params) => <TextField 
					{...params}
					{...props} 
				/>}
			/>
		</LocalizationProvider>
	)
}

export default DateTimeField