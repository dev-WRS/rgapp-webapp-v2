import { useState, useEffect } from 'react'
import { DndContext, closestCenter } from '@dnd-kit/core'
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import Tooltip from '@mui/material/Tooltip'
import ImageListItem from '@mui/material/ImageListItem'
import ImageListItemBar from '@mui/material/ImageListItemBar'
import MuiIconButton from '@mui/material/IconButton'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'

import SelectPhotoDescriptionField from 'components/core/SelectPhotoDescriptionField'
import IconButton from 'components/core/IconButton'
import PhotoGallery from 'components/core/PhotoGallery'
import InputFile from 'components/core/InputFile'
import { useTheme } from '@emotion/react'
import { Icon } from 'styles'
import { forEach } from 'lodash'

const PhotosList = ({
	error,
	inProgress,
	emptyText = 'Photo Gallery',
	photos: initialPhotos,
	onAdd,
	onAddMultiple,
	onUpdate,
	onDelete,
	onUpdatePhoto,
	onUpdateChange,
	onReorderPhotos
}) => {
	const theme = useTheme()
	const [openErrorMsg, setOpenErrorMsg] = useState(false)
	const [open, setOpen] = useState(0)
	const [openForChange, setOpenForChange] = useState(false)
	const [photo, setPhoto] = useState(null)
	const [newPhoto, setNewPhoto] = useState(null)
	const [selectionIndex, setSelectionIndex] = useState(-1)
	const [description, setDescription] = useState(photo && photo.description ? photo.description : '')
	const [photos, setPhotos] = useState(initialPhotos)
	const [isReordering, setIsReordering] = useState(false)

	useEffect(() => {
		setOpenErrorMsg(error ? true : false)
	}, [error])

	useEffect(() => {
		setPhotos(initialPhotos)
	}, [initialPhotos])

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
		photo.position = photos.length
		onAdd && onAdd({ ...photo })
		setPhoto(null)
		setDescription('')
		setSelectionIndex(-1)
	}

	const handleAddMultiple = async (photosToUpload) => {
        let startPosition = photos.length;
        const formattedPhotos = photosToUpload.map((photo, index) => ({
            ...photo,
            position: startPosition + index
        }));

        await onAddMultiple && onAddMultiple(formattedPhotos);
        setNewPhoto(null);
        setPhoto(null);
        setDescription('');
    };

	const handleUpdate = () => {
		photo.description = description
		onUpdate && onUpdate({ ...photo })
		setDescription('')
		setPhoto(null)
		setSelectionIndex(-1)
	}

	const handleDelete1 = (index) => (event) => {
		event.stopPropagation()
		const selectedPhoto = photos[index]
		onDelete && onDelete(selectedPhoto)
		setDescription('')
		setOpenForChange(false)
		setNewPhoto(null)
		setPhoto(null)
		setSelectionIndex(-1)
	}

	const handleDelete = (index) => (event) => {
		event.stopPropagation();

		const selectedPhoto = photos[index];
		const positionToRemove = selectedPhoto.position;

		const updatedPhotos = photos
			.filter(photo => photo.id !== selectedPhoto.id)
			.map(photo => {
				if (photo.position > positionToRemove) {
					return { ...photo, position: photo.position - 1 };
				}
				return photo;
			});

		setPhotos(updatedPhotos);

		onDelete && onDelete(selectedPhoto);

		onReorderPhotos && onReorderPhotos(updatedPhotos);

		setDescription('');
		setOpenForChange(false);
		setNewPhoto(null);
		setPhoto(null);
		setSelectionIndex(-1);
	};

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
		} else {
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
			handleAddMultiple(photosToUpload);
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

	// Drag and drop handlers
	const handleDragEnd = (event) => {
		if (!isReordering) return
		const { active, over } = event
		if (active.id !== over.id) {
			const oldIndex = photos.findIndex(photo => photo.id === active.id)
			const newIndex = photos.findIndex(photo => photo.id === over.id)
			const reorderedPhotos = arrayMove(photos, oldIndex, newIndex)
				.map((photo, index) => ({ ...photo, position: index }))

			setPhotos(reorderedPhotos)
			onReorderPhotos && onReorderPhotos(reorderedPhotos)
		}
	}

	const toggleReorder = () => {
		setIsReordering(!isReordering)
	}

	return (
		<Stack direction="column">
			<Stack direction="row" spacing={2}>
				<SelectPhotoDescriptionField id="description" label="Photo Description" disabled={inProgress || isReordering}
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
								disabled={(photo === null || (photo && !photo.id)) || (newPhoto !== null) || isReordering}
								onClick={handleOpenForChange}
							/>
						</span>
					</Tooltip>
					<Tooltip title={'Upload'} arrow>
						<span>
							<IconButton icon={'upload'} size={22} color={'white'} sx={{ marginTop: theme.spacing(1.2), marginRight: '5px' }}
								disabled={(photo && !!photo.id) || inProgress || isReordering}
								onClick={handleOpen}
							/>
						</span>
					</Tooltip>
					<Tooltip title={'Add'} arrow>
						<span>
							<IconButton disabled={photo === null || (photo && !!photo.id) || isReordering} icon={'plus'} size={22}
								color="white"
								sx={{ marginTop: theme.spacing(1.2), marginRight: '5px' }}
								onClick={handleAdd}
							/>
						</span>
					</Tooltip>
					<Tooltip title={'Update'} arrow>
						<span>
							<IconButton disabled={(photo === null || (photo && !photo.id)) || (newPhoto !== null) || isReordering} icon={'checkmark'} size={22}
								color={'white'}
								sx={{ marginTop: theme.spacing(1.2) }}
								onClick={handleUpdate}
							/>
						</span>
					</Tooltip>
					{/* Toggle para activar o desactivar el reordenamiento */}
					<Tooltip title={isReordering ? 'Disable Reorder' : 'Enable Reorder'} arrow>
						<span>
							<IconButton icon={!isReordering ? 'make-group' : 'thumbs-up-alt'} size={22} color={isReordering ? 'primary' : 'default'}
							disabled={photos.length < 2}
								sx={{ marginTop: theme.spacing(1.2) }}
								onClick={toggleReorder}
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
				{isReordering ? (
					<DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
						<SortableContext items={photos.map((photo) => photo.id)} strategy={verticalListSortingStrategy}>
							<PhotoGallery cols={2} rowHeight={182}>
								{photos.map((item, index) => (
									<SortablePhoto key={item.id} item={item} index={index} onDelete={handleDelete} onSelect={handleSelect} />
								))}
							</PhotoGallery>
						</SortableContext>
					</DndContext>
				) : (
					<PhotoGallery cols={2} rowHeight={182}>
						{photos.map((item, index) => (
							<ImageListItem key={item.id} onClick={handleSelect(index)}>
								<img
									style={{ border: selectionIndex === index ? '2px solid #88AC3ECC' : 'none' }}
									src={`/api/assets/${item.asset}`}
									alt={item.description}
									loading="lazy"
								/>
								<ImageListItemBar
									title={item.description}
									actionIcon={
										<MuiIconButton onClick={(e) => handleDelete(index)(e)} disabled={isReordering}>
											<Icon icon={'trash-can'} size={22} color={'white'} />
										</MuiIconButton>
									}
								/>
							</ImageListItem>
						))}
					</PhotoGallery>
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

const SortablePhoto = ({ item, index, onDelete, onSelect }) => {
	const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.id })
	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	}

	return (
		<ImageListItem ref={setNodeRef} style={style} {...attributes} {...listeners}>
			<img
				style={{ border: '2px solid #88AC3ECC' }}
				src={`/api/assets/${item.asset}`}
				alt={item.description}
				loading="lazy"
			/>
			<ImageListItemBar
				title={item.description}
				actionIcon={
					<MuiIconButton onClick={(e) => onDelete(index)(e)}>
						<Icon icon={'trash-can'} size={22} color={'white'} />
					</MuiIconButton>
				}
			/>
		</ImageListItem>
	)
}

export default PhotosList
