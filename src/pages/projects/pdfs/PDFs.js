import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import PdfUploadForm from 'components/PdfUploadForm'
import { updateProjectPdf } from 'actions'

const PDFs = ({
	submit,
	projectId,
	isLoading,
	inProgress,
	onSubmit
}) => {
	const dispatch = useDispatch()
	const project = useSelector(state => state.projects && state.projects.data &&
		projectId && state.projects.data.find(project => project.id === projectId))
	const { certificate45L, baselineDesign179D, wholeBuildingDesign179D, buildingSummary179D, softwareCertificate179D } = project
	const reportType = project.reportType
	const [errorState, setErrorState] = useState()

	useEffect(() => {
		if (submit) {
			onSubmit && onSubmit(true)
		}
	}, [submit, onSubmit])
	
	const handleChange = async (name, pdf) => {
		const data = new FormData()

		data.append('file', pdf)
		
		const { error } = await dispatch(updateProjectPdf(projectId, name, data))
		if (error) setErrorState(error)
	}

	return (
		<PdfUploadForm
			type={reportType}
			error={errorState}
			inProgress={inProgress}
			pdfs={{ 
				certificate45L, 
				baselineDesign179D, 
				wholeBuildingDesign179D, 
				buildingSummary179D, 
				softwareCertificate179D 
			}}
			onChange={handleChange}
		/>
	)
}

export default PDFs