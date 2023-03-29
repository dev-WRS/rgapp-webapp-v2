import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTheme } from '@emotion/react'
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import MuiDrawer from '@mui/material/Drawer'
import MuiAppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import List from '@mui/material/List'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import MuiListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Avatar from '@mui/material/Avatar'

import Navigator from 'pages/Navigator'
import ProfilePopover from 'components/ProfilePopover'
import UserAvatar from 'components/UserAvatar'
import { COMPANY_NAME } from 'constants'
import { Icon } from 'styles'
import packageJson from '../../package.json'

const drawerWidth = 240

const drawerMixin = (theme) => ({
	color: 'white',
	backgroundColor: theme.palette.primary.main
})

const openedMixin = (theme) => ({
	width: drawerWidth,
	transition: theme.transitions.create('width', {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.enteringScreen,
	}),
	overflowX: 'hidden',
	...drawerMixin(theme)
})

const closedMixin = (theme) => ({
	transition: theme.transitions.create('width', {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen
	}),
	overflowX: 'hidden',
	width: `calc(${theme.spacing(7)} + 1px)`,
	[theme.breakpoints.up('sm')]: {
		width: `calc(${theme.spacing(8)} + 1px)`,
	},
	...drawerMixin(theme)
})

const DrawerHeader = styled('div', {
	shouldForwardProp: (prop) => prop !== 'open'
})(({ theme }) => ({
	display: 'flex',
	alignItems: 'center',
	paddingLeft: `calc(${theme.spacing(1)} + 1px)`,
	paddingRight: `calc(${theme.spacing(1)} + 1px)`,
	backgroundColor: theme.palette.brand.dark,
	// necessary for content to be below app bar
	...theme.mixins.toolbar
}))

const AppBar = styled(MuiAppBar, {
	shouldForwardProp: (prop) => prop !== 'open'
})(({ theme, open }) => ({
	zIndex: theme.zIndex.drawer + 1,
	transition: theme.transitions.create(['width', 'margin'], {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen
	}),
	...(open && {
		marginLeft: drawerWidth,
		width: `calc(100% - ${drawerWidth}px)`,
		transition: theme.transitions.create(['width', 'margin'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen
		})
	}),
	...(!open && {
		marginLeft: `calc(${theme.spacing(8)} + 1px)`,
		width: `calc(100% - 1px - ${theme.spacing(8)})`,
		transition: theme.transitions.create(['width', 'margin'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen
		})
	})
}))

const Drawer = styled(MuiDrawer, { 
	shouldForwardProp: (prop) => prop !== 'open' 
})(({ theme, open }) => ({
	width: drawerWidth,
	flexShrink: 0,
	whiteSpace: 'nowrap',
	boxSizing: 'border-box',
	...(open && {
		...openedMixin(theme),
		'& .MuiDrawer-paper': openedMixin(theme)
	}),
	...(!open && {
		...closedMixin(theme),
		'& .MuiDrawer-paper': closedMixin(theme)
	})
}))

const ListItem = styled(MuiListItem)(({ theme }) => ({
	'&.Mui-selected': {
		backgroundColor: theme.palette.brand.dark,
		boxShadow: `4px 0px ${theme.palette.brand.beige} inset`
	}
}))

const MainLayout = ({ auth, routes, onChangePassword, onLogout }) => {
	const theme = useTheme()
	const location = useLocation()
	const navigate = useNavigate()
	const menuItems = useMemo(() => routes.filter(({ page }) => (!!page)), [routes])
	const initialIndex = useMemo(() => {
		const index = menuItems.findIndex(({ path }) => (location.pathname === path))
		return (index !== -1) ? index : 0
	}, [location.pathname, menuItems])
	const [title, setTitle] = useState(menuItems[initialIndex] ? menuItems[initialIndex].text : '')
	const [selectedIndex, setSelectedIndex] = useState(initialIndex)
	const [open, setOpen] = useState(true)
	const [anchorEl, setAnchorEl] = useState(null)
	const [openProfile, setOpenProfile] = useState(false)
	const isValidUser = (auth && !!auth.id)

	useEffect(() => {
		if (menuItems && menuItems[selectedIndex]) {
			const menuItem = menuItems[selectedIndex]

			setTitle(menuItem.text)
			navigate(menuItem.path)
		}
	}, [selectedIndex, menuItems, navigate])

	const handleDrawerToggle = () => setOpen(!open)
	const handleProfileOpen = (event) => {
		setAnchorEl(event.currentTarget)
		setOpenProfile(true)
	}
	const handleProfileClose = () => {
		setAnchorEl(null)
		setOpenProfile(false)
	}
	const handleChangePassword = () => {
		handleProfileClose()
		onChangePassword && onChangePassword()	
	}
	const handleLogout = () => {
		handleProfileClose()
		onLogout && onLogout()	
	}
	const handleItemSelect = (newSelectedIndex) => (event) => setSelectedIndex(newSelectedIndex)

	return (
		<Box sx={{ display: 'flex', height: '100%' }}>
			<AppBar position="fixed" open={open} sx={{
				backgroundColor: 'white',
				boxShadow: '0px 2px 6px #0000000a'
			}}>
				<Toolbar>
					<Typography noWrap component="div" color="text.primary" sx={{
						fontSize: '18px',
						lineHeight: '33px'
					}}>
						{title}
					</Typography>
					<Box sx={{ flexGrow: 1 }}/>
					<UserAvatar
						name={auth ? (auth.email || auth.name) : ''}
						onClick={handleProfileOpen}
					/>
				</Toolbar>
			</AppBar>
			<Drawer variant="permanent" open={open}>
				<DrawerHeader>
					<IconButton onClick={handleDrawerToggle}>
						<Avatar alt={COMPANY_NAME} src="/build/Logo.svg" sx={{
							backgroundColor: 'primary.main',
							borderStyle: 'solid',
							borderWidth: '1px',
							width: 30, 
							height: 30 
						}}/>
					</IconButton>
					<Typography align="center" sx={{
						color: 'secondary.main',
						fontSize: '20px',
						lineHeight: '20px',
						fontWeight: 'bold',
						letterSpacing: '4px',
						textTransform: 'uppercase',
						overflowX: 'hidden',
						ml: 1.5
					}}>
						RepGenx
					</Typography>
				</DrawerHeader>
				<Divider />
				<List sx={{ pt: 0.25, height: '100%' }}>
					{menuItems.map(({ text, icon }, index) => (
						<ListItem key={text}
							selected={selectedIndex === index}
							disablePadding 
							sx={{ display: 'block' }}
							onClick={handleItemSelect(index)}
						>
							<ListItemButton
								sx={{
									minHeight: 48,
									justifyContent: open ? 'initial' : 'center',
									px: 2.5
								}}
							>
								<ListItemIcon
									sx={{
										color: (selectedIndex === index) ? theme.palette.brand.beige : 'white',
										minWidth: 0,
										mr: open ? 3 : 'auto',
										justifyContent: 'center'
									}}
								>
									<Icon icon={icon} size={24} color={(selectedIndex === index) ? theme.palette.brand.beige : 'white'}/>
								</ListItemIcon>
								<ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
							</ListItemButton>
						</ListItem>
					))}
				</List>
				<Box mb={4}>
					<Typography align='center' variant="caption" display="block" gutterBottom>{packageJson.version}</Typography>
				</Box>
			</Drawer>
			<Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
				<Navigator routes={routes} isSecure={isValidUser} />
			</Box>
			{openProfile && (
				<ProfilePopover
					anchorEl={anchorEl}
					open={openProfile}
					auth={auth}
					onClose={handleProfileClose}
					onChangePassword={handleChangePassword}
					onLogout={handleLogout}
				/>
			)}
		</Box>
	)
}

export default MainLayout