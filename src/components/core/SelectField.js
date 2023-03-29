import { styled } from '@mui/material/styles'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import MuiSelect from '@mui/material/Select'

const Select = styled(MuiSelect)(({ theme }) => ({
	'& .MuiInputLabel-root': {
		color: theme.palette.primary,
		//borderColor: theme.palette.primary
	},

	'& label.Mui-focused': {
		color: theme.palette.primary,
		//borderColor: theme.palette.primary
	},
	'& .MuiInput-underline:after': {
		color: theme.palette.primary,
		borderColor: theme.palette.primary
	},
	'&.MuiInput': {
		'&::placeholder': {
			color: '#d32f2f'
		}
	},
	'& .MuiSelect-root': {
		'& fieldset': {
			borderColor: theme.palette.primary
		},
		'&:hover .MuiOutlinedInput-notchedOutline': {
			borderColor: "#88AC3E"
		},
		'&.Mui-error': {
			'&:hover fieldset': {
				borderColor: "#d32f2f"
			}
		},
		'&.Mui-focused fieldset': {
			borderColor: theme.palette.primary
		},
		'&.Mui-disabled': {
			'&:hover fieldset': {
				borderColor: "rgba(0, 0, 0, 0.38)"
			}
		},
	}
}))

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
	const handleChange = (event) => {
		event.target.id = id
		event.target.name = name
		onChange && onChange(event)
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
				labelId={`${id}-label`}
				id={id}
				value={value || ''}
				label={label}
				onChange={handleChange}
				onBlur={onBlur}
				MenuProps={MenuProps}
			>
				{options.map((option, index) => (
					option[valueProp] ? (
						<MenuItem key={`${option[valueProp]}-${index}`}
							value={option[valueProp]}
						>{option[textProp]}</MenuItem>
					) : (
						<MenuItem key={`${option[valueProp]}-${index}`}
							value={option[valueProp]}
						><em>{option[textProp]}</em></MenuItem>
					)
					
				))}
			</Select>
			<FormHelperText>{helperText}</FormHelperText>
		</FormControl>
	)
}

export default SelectField