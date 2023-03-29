import Backdrop from '@mui/material/Backdrop'
import Stack from '@mui/material/Stack'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'

const LoadingMask = ({
	open,
	color,
	loadingText
}) => {
	return (
		<Backdrop
			sx={{ 
				color, 
				zIndex: (theme) => theme.zIndex.drawer + 1 
			}}
			open={open}
		>
			<Stack direction="column" spacing={2} 
				justifyContent="center"
				alignItems="center"
			>
				<CircularProgress color="inherit" />
				<Typography color="inherit">{loadingText}</Typography>
			</Stack>
		</Backdrop>
	)
}

export default LoadingMask