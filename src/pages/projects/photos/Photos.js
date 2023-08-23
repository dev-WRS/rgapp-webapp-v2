import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import PhotosList from 'components/PhotosList'
import { createProjectPhoto, updateProjectPhoto, deleteProjectPhoto, updateProjectPhotoChange } from 'actions'

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
	// const photos = (mode === 'edit' && project['photos']) ? project['photos'] : []
	const photos = (project && project['photos']) ? project['photos'] : []
	const [errorState, setErrorState] = useState()

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

	const handleUpdate = async ({ id, description }) => {
		const { error } = await dispatch(updateProjectPhoto(projectId, { id, description }))
		if (error) setErrorState(error)
	}

	const handlePhotoChange = async ( {asset, photo}) => {
		const data = new FormData()
		data.append('asset', asset)

		const { error } = await dispatch(updateProjectPhotoChange(projectId, photo.asset, data))
		if (error) setErrorState(error)
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
			onUpdate={handleUpdate}
			onDelete={handleDelete}
			onUpdatePhoto={handlePhotoChange}
		/>
	)
}

export default Photos