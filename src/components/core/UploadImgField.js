import { useEffect, useState } from 'react'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'

import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogActions from '@mui/material/DialogActions'
import Button from 'components/core/Button'

import InputFile from 'components/core/InputFile'
import IconButton from 'components/core/IconButton'
import { useTheme } from '@emotion/react'

import _ from 'lodash'

const imageSize = (file) => new Promise((resolve) => {
	if (file && Image) {
		const img = new Image()

		img.onload = () => {
			resolve({
				width: img.width,
				height: img.height
			})
		}

		img.src = URL.createObjectURL(file)
	}
	else {
		resolve({
			width: null,
			height: null
		})
	}
})

const UploadImgField = ({
	id,
	name,
	label,
	description,
	aspectRatio,
	aspectRatioWarningMsg,
	direction = 'row', //row, column
	fullWidth,
	width,
	height,
	preview = false,
	allowClear = true,
	disabled,
	value,
	error,
	helperText,
	inProgress,
	onChange
}) => {
	const theme = useTheme()
	const [open, setOpen] = useState(0)
	const [openDialog, setOpenDialog] = useState(false)
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

	const handleCloseDialog = () => {
		setOpenDialog(false)
	}

	const handleChange = async (event) => {
		const files = event.target.files
		const image = files[0]
		let isValid = true

		if (image && aspectRatio) {
			const { width, height } = await imageSize(image)
			const ratio = height / width

			isValid = _.isArray(aspectRatio) ? (aspectRatio[0] <= ratio && ratio <= aspectRatio[1]) : (aspectRatio === ratio)
		}

		if (!isValid) {
			setOpenDialog(true)
		}

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
					{!src && (
						<Stack direction="column" 
							justifyContent="center"
							alignItems="center"
						>
							<Typography color={disabled ? 'rgba(0, 0, 0, 0.38)' : 'primary'}>{label}</Typography>
							{description && (<Typography color={disabled ? 'rgba(0, 0, 0, 0.38)' : 'primary'} variant="body2">{description}</Typography>)}
						</Stack>
					)}
				</Box>
				{!preview && (
					<Stack
						direction={direction === 'row' ? 'column' : direction}
						justifyContent={direction === 'row' ? 'center' : 'flex-end'}
						alignItems="center"
					>
						{allowClear && (
							<IconButton icon='eraser' size={22} color={'white'} sx={{ margin: theme.spacing(1) }} disabled={inProgress}
								onClick={handleClear}
							/>
						)}
						<IconButton icon='upload' size={22} color={'white'} sx={{ margin: theme.spacing(1) }} disabled={inProgress}
							onClick={handleOpen}
						/>
					</Stack>
				)}
				<InputFile
					id={id}
					name={name}
					open={open}
					accept="image/png,image/jpeg,image/svg+xml"
					hidden
					onChange={handleChange}
				/>
			</Stack>
			<FormHelperText>{helperText}</FormHelperText>
			<Dialog
				open={openDialog}
				onClose={handleCloseDialog}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle id="alert-dialog-title">
					{"Upload image"}
				</DialogTitle>
				<DialogContent>
					<DialogContentText id="alert-dialog-description">
						{aspectRatioWarningMsg}
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseDialog} autoFocus>
						Done
					</Button>
				</DialogActions>
			</Dialog>
		</FormControl>
	)
}

export default UploadImgField