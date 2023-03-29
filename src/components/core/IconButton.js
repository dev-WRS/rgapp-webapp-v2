import MuiIconButton from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'
import { Icon } from 'styles'

const IconButton = styled(MuiIconButton)(({ theme }) => ({
	'&.Mui-disabled': {
		backgroundColor: theme.palette.brand.gray
	},
	'&:hover': {
		backgroundColor: theme.palette.secondary.main
	  }
}))

const IconButtonWrap = ({ sx, icon, size, color, ...props }) => {
	return (
		<IconButton
			sx={{
				borderRadius: '4px', 
				backgroundColor: '#88AC3E',
				marginRight: .5, 
				marginLeft: .5, 
				stroke: color, 
				strokeWidth: '15px', 
				opacity: '0.7',
				...sx
			}}
			{...props}								
		>
			<Icon icon={icon} size={size} color={color}/>
		</IconButton>
	)
}

export default IconButtonWrap