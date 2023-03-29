import { styled } from '@mui/material/styles'
import MuiImageList from '@mui/material/ImageList'

const PhotoGallery = styled(MuiImageList)(({ theme }) => ({
	'& .MuiImageListItemBar-titleWrap': {
		padding: '7px 10px'
	},
	'& .MuiImageListItemBar-title': {
		fontSize: '12px',
	},
	'& .MuiImageListItem-img': {
		cursor: 'pointer',
		height: '182px !important'
	}
}))

const PhotoGalleryWrap = ({ sx, helperText, ...props }) => {
	return (
		<PhotoGallery
			sx={{
				...sx
			}}
			{...props}
		/>
	)
}

export default PhotoGalleryWrap