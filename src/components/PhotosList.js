import { useState, useEffect } from 'react'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import Tooltip from '@mui/material/Tooltip'
import ImageListItem from '@mui/material/ImageListItem'
import ImageListItemBar from '@mui/material/ImageListItemBar'
import MuiIconButton from '@mui/material/IconButton'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'

import TextField from 'components/core/TextField'
import IconButton from 'components/core/IconButton'
import PhotoGallery from 'components/core/PhotoGallery'

import InputFile from 'components/core/InputFile'
import { useTheme } from '@emotion/react'
import { Icon } from 'styles'

const PhotosList = ({
	error,
	inProgress,
	emptyText = 'Photo Gallery',
	photos,
	onAdd,
	onUpdate,
	onDelete,
	onUpdatePhoto
}) => {
	const theme = useTheme()
	const [openErrorMsg, setOpenErrorMsg] = useState(false)
	const [open, setOpen] = useState(0)
	const [openForChange, setOpenForChange] = useState(false)
	const [photo, setPhoto] = useState(null)
	const [newPhoto, setNewPhoto] = useState(null)
	const [selectionIndex, setSelectionIndex] = useState(-1)

	useEffect(() => {
		setOpenErrorMsg(error ? true : false)	
	}, [error])

	const handleErrorMsgClose = () => setOpenErrorMsg(false)

	const handleAdd = () => {
		onAdd && onAdd({ ...photo })
		setPhoto(null)
		setSelectionIndex(-1)
	}

	const handleUpdate = () => {
		onUpdate && onUpdate({ ...photo })
		setPhoto(null)
		setSelectionIndex(-1)
	}

	const handleDelete = (index) => (event) => {
		event.stopPropagation()
		const selectedPhoto = photos[index]
		onDelete && onDelete(selectedPhoto)
	}

	const handleOpen = () => {
		setOpen(open + 1)
	}

	const handleOpenForChange = () => {
		setOpen(open + 1)
		setOpenForChange(true)
	}

	const handlePhotoChange = () => {
		onUpdatePhoto && onUpdatePhoto( newPhoto )
		setNewPhoto(null)
		setSelectionIndex(-1)
	}

	const handleSelect = (index) => (event) => {
		if (index === selectionIndex) {
			setPhoto(null)
			setSelectionIndex(-1)
		}
		else {
			const newPhoto = photos[index]

			setSelectionIndex(index)
			setPhoto({ ...newPhoto })
		}
	}

	const handleFileChange = (event) => {
		const asset = event.target.files[0]
		if (asset) {
			const description = asset.name
			setOpen(0)
			if (!openForChange) {
					setPhoto(photo ? { ...photo, description, asset } : { description, asset })
				} else {
					setNewPhoto({ photo, asset })
			}
		} 

	}

	const handleDescriptionChange = (event) => {
		const description = event.target.value
		
		if (photo) {
			setPhoto({ ...photo, description })
		}
	}

	return (
		<Stack direction="column">
			<Stack direction="row" spacing={2}>
				<TextField id="description" label="Photo Description" disabled={inProgress}
					fullWidth
					size={'medium'}
					value={(photo && photo.description) || ''}
					onChange={handleDescriptionChange}
				/>
				<Stack
					direction='row'
					justifyContent='center'
					alignItems="flex-start"
				>
					<Tooltip title={'Replace'} arrow>
						<span>
							<IconButton icon={'swap'} size={22} color={'white'} sx={{ marginTop: theme.spacing(1.2), marginRight: '5px' }} 
								disabled={(newPhoto && !!newPhoto.id) || inProgress} 
								onClick={handlePhotoChange} 
							/>
						</span>
					</Tooltip>
					<Tooltip title={'Upload'} arrow>
						<span>
							<IconButton icon={'upload'} size={22} color={'white'} sx={{ marginTop: theme.spacing(1.2), marginRight: '5px' }} 
								disabled={(photo && !!photo.id) || inProgress} 
								onClick={handleOpen} 
							/>
						</span>
					</Tooltip>
					<Tooltip title={'Add'} arrow>
						<span>
							<IconButton disabled={photo === null || (photo && !!photo.id)} icon={'plus'} size={22}
								color="white"
								sx={{ marginTop: theme.spacing(1.2), marginRight: '5px' }} 
								onClick={handleAdd} 
							/>
						</span>
					</Tooltip>
					<Tooltip title={'Update'} arrow>
						<span>
							<IconButton disabled={photo === null || (photo && !photo.id)} icon={'checkmark'} size={22} 
								color={'white'} 
								sx={{ marginTop: theme.spacing(1.2) }} 
								onClick={handleUpdate} 
							/>
						</span>
					</Tooltip>
				</Stack>
			</Stack>
			<InputFile
				id="photos"
				open={open}
				accept="image/png, image/jpeg"
				hidden
				onChange={handleFileChange}
			/>
			<Box
				alignItems="center"
				justifyContent="center"
				display="flex"
				flex={1}
				mb={3}
				sx={{
					minHeight: '302px',
					borderRadius: '4px',
					borderStyle: 'solid',
					borderWidth: '1px',
					borderColor: 'rgba(0, 0, 0, 0.23)'
				}}
			>
				{(photos && photos.length > 0) ? (
					<PhotoGallery sx={{ width: 552, height: 302, margin: 0 }} cols={2} rowHeight={182}>
						{photos.map((item, index) => (
							<ImageListItem key={index} onClick={handleSelect(index)}>
								<img
									style={{ border: selectionIndex !== index ? 'none' : '2px solid #88AC3ECC' }}
									src={`/api/assets/${item.asset}`}
									srcSet={`/api/assets/${item.asset}`}
									alt={item.description}
									loading="lazy"
								/>
								<ImageListItemBar
									sx={{ backgroundColor: selectionIndex !== index ? '#4D4F5CCC' : '#88AC3ECC' }}
									title={item.description}
									position="top"
									actionIcon={
										<MuiIconButton sx={{ position: 'relative', top: 0 }}
											disabled={inProgress}
											onClick={handleOpenForChange}
										>
											<Icon icon={'swap'} size={22} color={'white'} />
										</MuiIconButton>
									}
								/>
								<ImageListItemBar
									sx={{ backgroundColor: selectionIndex !== index ? '#4D4F5CCC' : '#88AC3ECC' }}
									title={item.description}
									actionIcon={
										<MuiIconButton sx={{ position: 'relative', top: 0 }}
											disabled={inProgress}
											onClick={handleDelete(index)}
										>
											<Icon icon={'trash-can'} size={22} color={'white'} />
										</MuiIconButton>
									}
								/>
							</ImageListItem>
						))}
					</PhotoGallery>
				) : (
					<Typography color={'rgba(0, 0, 0, 0.38)'}>{emptyText}</Typography>
				)}
			</Box>
			{(openErrorMsg) && (
				<Snackbar open={openErrorMsg} autoHideDuration={6000} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} onClose={handleErrorMsgClose}>
					<Alert onClose={handleErrorMsgClose} severity="error" variant="filled">
						{error.message}
					</Alert>
				</Snackbar>
			)}
		</Stack>
	)
}

export default PhotosList