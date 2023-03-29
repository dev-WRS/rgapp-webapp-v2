import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import Button from 'components/core/Button'
import UploadCSVButton from 'components/core/UploadCSVButton'

const EnterDataOptions = ({
	csvOptions,
	onEnterManually,
	onValueChange
}) => {
	return (
		<Stack direction='column'
			alignItems="center"
			justifyContent="center"
			display="flex"
			flex={1}
			sx={{
				height: '302px',
				borderWidth: '1px',
				borderRadius: '4px',
				borderStyle: 'solid',
				borderColor: 'rgba(0, 0, 0, 0.23)'
			}}
		>
			<UploadCSVButton
				id="csv"
				options={csvOptions}
				onChange={onValueChange}
			/>
			<Typography p={3}>or</Typography>
			<Button
				variant="contained"
				onClick={onEnterManually}
				sx={{
					borderRadius: '4px',
					backgroundColor: '#646c68',
					marginRight: .5,
					marginLeft: .5,
					stroke: 'white',
					strokeWidth: '15px',
					opacity: '0.7'
				}}
			>Enter manually</Button>
		</Stack>
	)
}

export default EnterDataOptions