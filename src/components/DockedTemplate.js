import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import { COMPANY_NAME } from 'constants'

const DockedTemplate = ({ formElement }) => {
	return (
		<Stack
			height="100%"
			direction="row"
			justifyContent="flex-start"
			alignItems="stretch" 
		>
			<Stack width="50%"
				direction="column"
				justifyContent="flex-end"
				alignContent="center"
				sx={{ 
					background: 'linear-gradient(39deg, rgba(136,172,62,1) 0%, rgba(40,54,7,1) 100%)'
				}}
			>
				<Box
					sx={{
						height: '52%',
						backgroundImage: 'url("./build/Logo.svg")',
						backgroundSize: 'cover'
					}}
				/>
			</Stack>
			<Stack width="50%"
				direction="column"
				justifyContent="center"
				alignItems="center"
				sx={{
					px: 12,
					background: 'white'
				}}
			>
				{formElement}
				<Typography flex={1} sx={{
					fontSize: '16px',
					lineHeight: '19px',
					textAlign: 'center',
					position: 'absolute',
					bottom: 0,
					pb: 4
				}}>{`${COMPANY_NAME} ${(new Date()).getFullYear()}. All rights reserved.`}</Typography>
			</Stack>
		</Stack>
	)
}

export default DockedTemplate