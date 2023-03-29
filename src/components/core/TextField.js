import { styled } from '@mui/material/styles'
import MuiTextField from '@mui/material/TextField'

const TextField = styled(MuiTextField)(({ theme }) => ({
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
		},
		'&.Mui-disabled': {
			'&:hover fieldset': {
				borderColor: "rgba(0, 0, 0, 0.38)"
			}
		},
	}
}))

const TextFieldWrap = ({ sx, helperText, ...props }) => {
	return (
		<TextField
			sx={{
				pb: helperText ? 0 : 3,
				...sx
			}}
			helperText={helperText}
			variant="outlined"
			color="secondary"
			{...props}
		/>
	)
}

export default TextFieldWrap