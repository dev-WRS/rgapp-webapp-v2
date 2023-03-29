import { Box } from '@mui/material'
import { styled } from '@mui/material/styles'
import MuiTextField from '@mui/material/TextField'
import { forwardRef } from 'react'

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

const InputComponent = forwardRef((props, ref) => {
	const { ...others } = props
	return (
		<Box
			getInputRef={ref}
			{...others}
		/>
	)
})
const TextFieldWrap = ({ children, label, isEmpty, sx, inProgress, ...others }) => {
	return (
		<TextField
			sx={{
				pb: 3,
				...sx
			}}
			fullWidth
			color="secondary"
			variant="outlined"
			label={label}
			multiline
			rows={4}
			InputLabelProps={{ shrink: !isEmpty }}
			InputProps={{
				inputComponent: InputComponent
			}}
			inputProps={{ children: children }}
			disabled={inProgress}
			{...others}
		/>
	);
};
export default TextFieldWrap;