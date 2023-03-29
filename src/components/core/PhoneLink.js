import { useTheme } from '@emotion/react'
import Button from '@mui/material/Button'
import NumberFormat from 'react-number-format'

const PhoneLink = ({ 
	href,
	sx, 
	...others 
}) => {
	const theme = useTheme()
    return (
        href && (
			<Button href={'tel:' + href} color='primary' {...others}
				sx={{
					fontWeight: 'normal',
					padding: theme.spacing(.1, .5),
					...sx
				}}
			>
				<NumberFormat value={href} displayType={'text'} format="(###) ###-####" />
			</Button>
		)
    )
}

export default PhoneLink