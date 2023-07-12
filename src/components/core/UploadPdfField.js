import { useEffect, useState } from 'react'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'

import InputFile from 'components/core/InputFile'
import IconButton from 'components/core/IconButton'
import { useTheme } from '@emotion/react'

import _ from 'lodash'

const UploadPdfField = ({
	id,
	name,
	label,
	direction = 'row', //row, column
	fullWidth,
	width,
	height,
	allowClear = true,
	value,
	error,
	helperText,
	inProgress,
	onChange
}) => {
	const theme = useTheme()
	const [open, setOpen] = useState(0)
	const [src, setSrc] = useState()

	useEffect(() => {
		if (_.isObject(value)) {
			setSrc(URL.createObjectURL(value))
		}
		else {
			setSrc(value)
		}
	}, [value])

	const handleOpen = () => {
		setOpen(open + 1)
	}

	const handleChange = (event) => {
		const files = event.target.files

		setOpen(0)
		onChange && onChange({
			target: { id, name, files }
		})
	}

	const handleClear = () => {
		setSrc(null)
		onChange && onChange({
			target: { id, name, files: [] }
		})
	}
                                                                                                                                                                                                                                                                                 
	const setPdfView = () => {
		console.log('setPdfView')
		const opened = window.open(`${value}`, '_blank')
		if (opened) opened.focus()
	}

	return (
		<FormControl fullWidth={fullWidth} error={error}>
			<Stack
				direction={direction}
				sx={{
					mb: helperText ? 0 : theme.spacing(3.2)
				}}
			>
				<Box
					alignItems="center"
					justifyContent="center"
					display="flex"
					flex={1}
					sx={{
						width,
						height,
						borderRadius: '4px',
						borderStyle: 'solid',
						borderWidth: error ? '2px' : '1px',
						borderColor: error ? theme.palette.error.dark : 'rgba(0, 0, 0, 0.23)',
						backgroundImage: src ? `url(${src})` : 'none',
						backgroundSize: 'contain',
						backgroundPosition: 'center',
						backgroundRepeat: 'no-repeat'
					}}
				>
					{src ? (
						<object data={src} type="application/pdf" width="100%" height="100%" 
						sx={{cursor: 'wait'}}>
							<p>Alternative text - include a link <a href={src}>to the PDF!</a></p>
						</object>
					) : (
						<Typography align='center' m={2}>{label}</Typography>
					)}
				</Box>
				<Stack
					direction={direction === 'row' ? 'column' : direction}
					justifyContent={direction === 'row' ? 'space-between' : 'space-between'}
					alignItems="center"
				>
					{allowClear && (
						<IconButton icon='eraser' size={22} color={'white'} sx={{ margin: theme.spacing(1) }} disabled={inProgress}
							onClick={handleClear}
						/>
					)}
					<IconButton icon='top-right-arrow-box' size={22} color={'white'} sx={{ margin: theme.spacing(1) }} disabled={inProgress}
						onClick={setPdfView}
					/>
					<IconButton icon='upload' size={22} color={'white'} sx={{ margin: theme.spacing(1) }} disabled={inProgress}
						onClick={handleOpen}
					/>
				</Stack>
				<InputFile
					id={id}
					name={name}
					open={open}
					accept="application/pdf"
					hidden
					onChange={handleChange}
				/>
			</Stack>
			<FormHelperText>{helperText}</FormHelperText>
		</FormControl>
	)
}

export default UploadPdfField