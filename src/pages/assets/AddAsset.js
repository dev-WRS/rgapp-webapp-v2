/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import { createAsset } from 'actions'
import { MSG_TYPE } from 'constants'

import InputFile from 'components/core/InputFile'

const AddAsset = ({
	onClose
}) => {
	const dispatch = useDispatch()
	const [openDialog, setOpenDialog] = useState(false)

	useEffect(() => {
		setOpenDialog(true)
	}, [])

	const handleChange = async (event) => {
		const file = event.target.files[0]
		const data = new FormData() 
        
		data.append('file', file)

		const { error } = await dispatch(createAsset(data))

		if (error) {
			onClose({
				type: MSG_TYPE.error,
				message: error.message
			})
		}
		else {
			onClose({
				type: MSG_TYPE.success,
				message: 'The asset has been successfully created'
			})
		}
	}

	return (
		<InputFile 
			name="file"
			open={openDialog}
			accept="application/pdf, image/png, image/jpeg"
			hidden
			onChange={handleChange}
		/>
	)
}

export default AddAsset