// { vertical: 'bottom', horizontal: 'left' }
import Snackbar from '@mui/material/Snackbar'

const SnackbarWrap = (props) => {
	return (
		<Snackbar
			anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
			{...props}
		/>
	)
}

export default SnackbarWrap