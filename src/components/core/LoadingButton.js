import LoadingButton from '@mui/lab/LoadingButton'

const ButtonWrap = ({ ...props }) => {
	return (
		<LoadingButton
			size="large"
			endIcon={<></>}
			loadingPosition="end"
			{...props}
		/>
	)
}

export default ButtonWrap