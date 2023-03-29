import IconButton from '@mui/material/IconButton'
import MuiAvatar from '@mui/material/Avatar'
import { useTheme } from '@emotion/react'

const stringAvatar = (name) => name.split(' ').reduce((result, w) => result += w[0], '')

const Avatar = ({ name }) => {
	const theme = useTheme()
	return (
		<MuiAvatar sx={{ 
			bgcolor: theme.palette.secondary.main,
			fontSize: '16px',
			fontWeight: 'bold',
			lineHeight: '23px',
			textTransform: 'uppercase',
			width: 38, height: 38 
		}}>{stringAvatar(name)}</MuiAvatar>
	)
}

const UserAvatar = ({ name, onClick }) => {
	return onClick ? (
		<IconButton onClick={onClick}>
			<Avatar name={name} />		
		</IconButton>
	) : (
		<Avatar name={name} />	
	)
}

export default UserAvatar