import { useState } from 'react'
import InputAdornment from '@mui/material/InputAdornment'

import TextField from 'components/core/TextField'

import { Icon } from 'styles';
import { useTheme } from '@emotion/react'
import { CircularProgress } from '@mui/material';

const SearchFormField = ({
	id,
	name,
	placeholder,
	onSearch,
	onClearSearch,
	onFilter,
	onChange,
	inProgress,
	...props
}) => {
	const theme = useTheme()
	const [value, setValue] = useState('')

	const handleValueChange = (event) => {
		const newValue = event.target.value

		setValue(newValue)

		onChange && onChange({
			target: { id, name, value: newValue }
		})
	}

	const handleKeyPress = (event) => {
		if (event.key === "Enter") {
			onSearch(value)
		}
	}

	return (
		<TextField
			InputProps={{
				startAdornment: <InputAdornment position="start"><Icon icon="search" size={14} color={theme.palette.text.primary} /></InputAdornment>,
				endAdornment: inProgress && <CircularProgress color="secondary" size={20} />
			}}
			value={value}
			onChange={handleValueChange}
			onKeyPress={handleKeyPress}
			{...props}
		/>
	)
}

export default SearchFormField