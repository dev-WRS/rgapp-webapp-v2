import { useEffect, useState } from 'react'

import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'

import PdfUpload45LForm from 'components/PdfUpload45LForm'
import PdfUpload179DForm from 'components/PdfUpload179DForm'

const mapping = {
	'45L': PdfUpload45LForm,
	'179D': PdfUpload179DForm
}

const PdfUploadForm = ({
	type,
	error,
	inProgress,
	pdfs,
	onChange
}) => {
	const [openErrorMsg, setOpenErrorMsg] = useState(false)
	const UploadForm = mapping[type]

	useEffect(() => {
		setOpenErrorMsg(error ? true : false)	
	}, [error])

	const handleErrorMsgClose = () => setOpenErrorMsg(false)

	return UploadForm ? (
		<>
			<UploadForm
				inProgress={inProgress}
				pdfs={pdfs}
				onChange={onChange}
			/>
			{(openErrorMsg) && (
				<Snackbar open={openErrorMsg} autoHideDuration={6000} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} onClose={handleErrorMsgClose}>
					<Alert onClose={handleErrorMsgClose} severity="error" variant="filled">
						{error.message}
					</Alert>
				</Snackbar>
			)}
		</>
	) : null
}

export default PdfUploadForm