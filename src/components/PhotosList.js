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
import SelectPhotoDescriptionField from 'components/core/SelectPhotoDescriptionField'

import InputFile from 'components/core/InputFile'
import { useTheme } from '@emotion/react'
import { Icon } from 'styles'
import { forEach } from 'lodash'

const PhotosList = ({
	error,
	inProgress,
	emptyText = 'Photo Gallery',
	photos,
	onAdd,
	onAddMultiple,
	onUpdate,
	onDelete,
	onUpdatePhoto,
	onUpdateChange
}) => {
	const theme = useTheme()
	const [openErrorMsg, setOpenErrorMsg] = useState(false)
	const [open, setOpen] = useState(0)
	const [openForChange, setOpenForChange] = useState(false)
	const [photo, setPhoto] = useState(null)
	const [newPhoto, setNewPhoto] = useState(null)
	const [selectionIndex, setSelectionIndex] = useState(-1)
	const [description, setDescription] = useState(photo && photo.description ? photo.description : '');

	useEffect(() => {
		setOpenErrorMsg(error ? true : false)	
	}, [error])

	 useEffect(() => {
		setTimeout(() => {
			console.log('newPhoto', newPhoto);
			if (newPhoto && openForChange) {
				onUpdatePhoto && onUpdatePhoto({...newPhoto})
				setOpenForChange(false)
				setNewPhoto(null)
				setPhoto(null)
				setSelectionIndex(-1)
				setDescription('')
			}
		}, 1000)

	},[newPhoto, onUpdatePhoto, openForChange]);

	const handleErrorMsgClose = () => setOpenErrorMsg(false)

	const handleAdd = () => {
		photo.description = description
		onAdd && onAdd({ ...photo })
		setPhoto(null)
		setDescription('')
		setSelectionIndex(-1)
	}

	const handleUpdate = () => {
		photo.description = description
		onUpdate && onUpdate({ ...photo })
		setDescription('')
		setPhoto(null)
		setSelectionIndex(-1)
	}

	const handleDelete = (index) => (event) => {
		event.stopPropagation()
		const selectedPhoto = photos[index]
		onDelete && onDelete(selectedPhoto)
		setDescription('')
		setOpenForChange(false)
		setNewPhoto(null)
		setPhoto(null)
		setSelectionIndex(-1)
	}

	const handleOpen = () => {
		setOpen(open + 1)
	}

	const handleOpenForChange = () => {
		setOpenForChange(true)
		setOpen(open + 1)
	}

	const handleSelect = (index) => (event) => {
		if (index === selectionIndex) {
			setPhoto(null)
			setSelectionIndex(-1)
			setDescription('')
		}
		else {
			const newPhoto = photos[index]
			setDescription(newPhoto.description)

			setSelectionIndex(index)
			setPhoto({ ...newPhoto })
			setNewPhoto({ photo: newPhoto, asset: null })
			setNewPhoto(null)
			onUpdateChange && onUpdateChange()
		}
	}

	const handleFileChange = (event) => {
		if (event.target.files.length === 0) {
			setNewPhoto(null)
			setPhoto(null)
			setDescription('')
		} else if (event.target.files.length === 1) {
			const asset = event.target.files[0]
			if (asset) {
				setOpen(0)
				if (!openForChange) {
						setPhoto(photo ? { ...photo, description: description === '' ? asset.name : description, asset } 
									   : { description: description === '' ? asset.name : description, asset })
						setNewPhoto(null);
					} else {
						setNewPhoto({ photo, asset })
						setPhoto(null)				
					}
					setDescription(description === '' ? asset.name : description)
			} 
		} else if (event.target.files.length > 1) {
			setOpen(0)
			const photosToUpload = []
			forEach(event.target.files, (asset) => {
				setDescription('')
				photosToUpload.push({ description, asset })
			})
			onAddMultiple && onAddMultiple(photosToUpload)
			setNewPhoto(null)
			setPhoto(null)
			setDescription('')
		}
	}

	const handleDescriptionChange = (event) => {
		setDescription(event.target.value)
		
		if (photo) {
			setPhoto({ ...photo, description })
		}
	}

	return (
		<Stack direction="column">
			<Stack direction="row" spacing={2}>
				{/* <TextField id="description" label="Photo Description"
					fullWidth
					size={'medium'}
					value={(photo && photo.description) || ''}
					onChange={handleDescriptionChange}
					disabled={inProgress || (newPhoto !== null)}
				/> */}
				<SelectPhotoDescriptionField id="description" label="Photo Description" disabled={inProgress}
					fullWidth
					size={'medium'}
					value={description}
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
								disabled={(photo === null || (photo && !photo.id)) || (newPhoto !== null)}
								// disabled={newPhoto === null} 
								onClick={handleOpenForChange} 
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
							<IconButton disabled={(photo === null || (photo && !photo.id)) || (newPhoto !== null)} icon={'checkmark'} size={22} 
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
				multiple={selectionIndex === -1}
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