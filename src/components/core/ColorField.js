import { Box, InputAdornment } from '@mui/material'
import { styled } from '@mui/material/styles'
import MuiTextField from '@mui/material/TextField'
import { useEffect, useState } from 'react'

const TextField = styled(MuiTextField)(({ theme }) => ({
	'& label.Mui-focused': {
		color: theme.palette.primary,
		borderColor: theme.palette.primary
	},
	'& .MuiInput-underline:after': {
		color: theme.palette.primary,
		borderColor: theme.palette.primary
	},
	'& .MuiOutlinedInput-root': {
		'& fieldset': {
			borderColor: theme.palette.primary
		},
		'&:hover fieldset': {
			borderColor: "#88AC3E"
		},
		'&.Mui-error': {
			'&:hover fieldset': {
				borderColor: "#d32f2f"
			}
		},
		'&.Mui-focused fieldset': {
			borderColor: theme.palette.primary
		}
	}
}))

const hexColorRegex = new RegExp('^[a-f0-9]{1,6}$')

const ColoFieldWrap = ({ sx, value, helperText, onChange, ...props }) => {
	const [color, setColor] = useState()

	useEffect(() => {
		if (hexColorRegex.test(value)) {
			setColor(value)
		}
	}, [value])

	const handleChange = (event) => {
		const { id, name, value: fieldvalue } = event.target

		if (hexColorRegex.test(fieldvalue) || fieldvalue === '') {
			const fieldname = id || name

			setColor(fieldvalue)

			onChange && onChange({
				target: {
					name: fieldname,
					value: fieldvalue
				}
			})
		}
	}

	return (
		<TextField
			sx={{
				pb: helperText ? 0 : 3,
				...sx
			}}
			helperText={helperText}
			variant="outlined"
			color="secondary"
			onChange={handleChange}
			inputProps={{ style: { textTransform: "uppercase" } }}
			InputProps={{
				startAdornment: <InputAdornment position="start">#</InputAdornment>,
				endAdornment: <InputAdornment position="end">
					<Box
						alignItems="center"
						justifyContent="center"
						display="flex"
						sx={{
							width: 36,
							height: 36,
							borderRadius: '4px',
							borderStyle: 'solid',
							borderWidth: '1px',
							borderColor: '#CFCECC',
							backgroundColor: `#${color}`
						}}
					/>
				</InputAdornment>
			}}
			{...props}
			value={color || ''}
		/>
	)
}

export default ColoFieldWrap