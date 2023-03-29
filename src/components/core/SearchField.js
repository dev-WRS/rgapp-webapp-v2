import { useState } from 'react'
import { styled, alpha } from '@mui/material/styles'
import MuiInputBase from '@mui/material/InputBase'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'

import { Icon } from 'styles';
import { useTheme } from '@emotion/react'

const Search = styled('div')(({ theme }) => ({
	position: 'relative',
	backgroundColor: alpha(theme.palette.common.white, 0.15),
	'&:hover': {
		backgroundColor: alpha(theme.palette.common.white, 0.25),
	},
	marginLeft: 0,
	width: '100%',
	[theme.breakpoints.up('sm')]: {
		width: 'auto'
	}
}))
  
const SearchIconWrapper = styled('div')(({ theme }) => ({
	padding: theme.spacing(0, 2),
	height: '100%',
	position: 'absolute',
	pointerEvents: 'none',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
}))
  
const InputBase = styled(MuiInputBase)(({ theme }) => ({
	color: 'inherit',
	height: '45px',
	'& .MuiInputBase-input': {
		padding: theme.spacing(1, 1, 1, 0),
		// vertical padding + font size from searchIcon
		paddingLeft: `calc(1em + ${theme.spacing(4)})`,
		transition: theme.transitions.create('width'),
		width: '100%',
		[theme.breakpoints.up('md')]: {
			width: '20ch'
		}
	}
}))

const SearchField = ({
	placeholder,
	onSearch,
	onClearSearch,
	onFilter
}) => {
	const theme = useTheme()
	const [value, setValue] = useState('')

	const handleClearSearch = () => {
		setValue('')
		onClearSearch && onClearSearch()
	}

	const handleValueChange = (event) => {
		setValue(event.target.value)
	}

	const handleKeyPress = (event) => {
		if (event.key === "Enter") {
			onSearch(value)
		}
	}

	return (
		<Search>
			<SearchIconWrapper>
				<Icon icon="search" size={20} color={theme.palette.text.primary}/>
			</SearchIconWrapper>
			<InputBase inputProps={{ 'aria-label': 'search' }} placeholder={placeholder}
				endAdornment={
					<InputAdornment position="end">
						{value && (
							<IconButton aria-label="clear criteria"
								onClick={handleClearSearch}
								sx={{ marginRight: .2, marginLeft: .5, stroke: theme.palette.text.primary, strokeWidth: "15px" }}
							>
								<Icon icon="close" size={14} color={theme.palette.text.primary}/>
							</IconButton>
						)}
						{onFilter && (
							<IconButton aria-label="advanced filters"
								onClick={onFilter}
								sx={{ marginRight: .5, marginLeft: .5, stroke: theme.palette.text.primary, strokeWidth: "15px" }}
							>
								<Icon icon="menu-alt-1" size={20} color={theme.palette.text.primary}/>
							</IconButton>
						)}
					</InputAdornment>
				}
				value={value}
				onChange={handleValueChange}
				onKeyPress={handleKeyPress}
			/>
		</Search>
	)
}

export default SearchField