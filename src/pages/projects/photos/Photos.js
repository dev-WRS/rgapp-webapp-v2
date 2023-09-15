import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import PhotosList from 'components/PhotosList'
import { createProjectPhoto, updateProjectPhoto, deleteProjectPhoto, updateProjectPhotoChange, 
		 createMultipleProjectPhoto } from 'actions'

const Photos = ({
	mode,
	submit,
	projectId,
	originalProjectID,
	inProgress,
	onSubmit
}) => {
	const dispatch = useDispatch()
	const project = useSelector(state => state.projects && state.projects.data &&
		projectId && state.projects.data.find(project => project.id === projectId))
	const photos = (project && project['photos']) ? project['photos'] : []
	const [errorState, setErrorState] = useState()
	const [changeDone, setChangeDone] = useState(false)

	useEffect(() => {
		if (submit) {
			onSubmit && onSubmit(true)
		}
	}, [submit, onSubmit])

	const handleAdd = async (photo) => {
		const data = new FormData()

		Object.keys(photo).forEach(name => data.append(name, photo[name]))

		const { error } = await dispatch(createProjectPhoto(projectId, data))
		if (error) setErrorState(error)
	}

	const handleAddMultiple = async( photosToUpload) => {
		const data = new FormData()
		photosToUpload.forEach(photo => {
			Object.keys(photo).forEach(name => data.append(name, photo[name]))
		})
		try {
			const { error } = await dispatch(createMultipleProjectPhoto(projectId, data))
			if (error) setErrorState(error)
		} catch (error) {
			setErrorState(error)
		}
	}

	const handleUpdate = async ({ id, description }) => {
		const { error } = await dispatch(updateProjectPhoto(projectId, { id, description }))
		if (error) setErrorState(error)
	}

	const handlePhotoChange = async ({asset, photo}) => {
		try {
			setTimeout(async () => {
				if (changeDone) {
					setChangeDone(false)
					return
				}
				const data = new FormData()
				data.append('asset', asset)
				let error = '';
				if (photo !== null) {
					error = await dispatch(updateProjectPhotoChange(projectId, photo.asset, data)).error
				} else {
					error = 'Please start again. There is a trouble with the photo selected.'
				}
				if (error) setErrorState(error)
	
				setChangeDone(true);
			}, 1000)
		} catch (error) {
			setErrorState(error)
		}
	}

	const handleUpdateChange = async () => {
		setChangeDone(false)
	}

	const handleDelete = async ({ id }) => {
		const { error } = await dispatch(deleteProjectPhoto(projectId, id))
		if (error) setErrorState(error)
	}

	return (
		<PhotosList
			error={errorState}
			photos={photos}
			inProgress={inProgress}
			onAdd={handleAdd}
			onAddMultiple={handleAddMultiple}
			onUpdate={handleUpdate}
			onDelete={handleDelete}
			onUpdatePhoto={handlePhotoChange}
			onUpdateChange={handleUpdateChange}
		/>
	)
}

export default Photos