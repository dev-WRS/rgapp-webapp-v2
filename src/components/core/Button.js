import Button from '@mui/material/Button'

const ButtonWrap = ({ ...props }) => {
	return (
		<Button
			size="large"
			{...props}
		/>
	)
}

export default ButtonWrap