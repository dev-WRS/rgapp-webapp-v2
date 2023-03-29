import Popover from '@mui/material/Popover'
import Card from '@mui/material/Card'
import MuiCardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import Stack from '@mui/material/Stack'
import { styled } from '@mui/material/styles'
import { useTheme } from '@emotion/react'

import MuiButton from 'components/core/Button'
import UserAvatar from 'components/UserAvatar'

const CardContent = styled(MuiCardContent)(({ theme }) => ({
	padding: theme.spacing(3),
	'&:last-child': {
		paddingBottom: 0
	}
}))

const Button = styled(MuiButton)(({ theme }) => ({
	color: theme.palette.text.primary,
	fontWeight: 'normal',
	textTransform: 'none',
	marginTop: theme.spacing(0.5),
	marginBottom: theme.spacing(0.5)	
}))

const ProfilePopover = ({ auth, onChangePassword, onLogout, ...props }) => {
	const theme = useTheme()
    return (
        <Popover
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }}
            {...props}
        >
            <Card>
                <CardContent>
					<Stack
						direction="row"
						alignItems="stretch"
						sx={{
							mb: 1
						}}
					>
						<UserAvatar name={auth.email || auth.name} />
						<Stack
							direction="column"
							justifyContent="center"
							alignItems="stretch"
							sx={{
								ml: 1
							}}
						>
							<Typography
								sx={{
									color: theme.palette.text.terciary,
									fontSize: '16px',
									lineHeight: '24px',
									fontWeight: 'bold'
								}}
							>
								{auth.name}
							</Typography>
							<Typography
								sx={{
									fontSize: '14px',
									lineHeight: '24px'
								}}
							>
								{auth.email}
							</Typography>
						</Stack>
					</Stack>
					<Divider />
					<Button fullWidth onClick={onChangePassword}>Change Password</Button>
					<Divider />
					<Button fullWidth onClick={onLogout}>Logout</Button>
                </CardContent>
            </Card> 
        </Popover>
    )    
}

export default ProfilePopover