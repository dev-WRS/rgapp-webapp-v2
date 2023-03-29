import _ from 'lodash'
import Stack from '@mui/material/Stack'

import UploadPdfField from 'components/core/UploadPdfField'

const asSrc = (value) => value ?  `/api/assets/${value}` : ''

const PdfUpload45LForm = ({
	inProgress,
	pdfs,
	onChange
}) => {
	const handleValueChange = (event) => {
		const { id, name } = event.target
		const pdf = event.target.files[0]

		if (pdf) {
			onChange && onChange(id || name, pdf)
		}
	}

	return (
		<Stack direction="row" spacing={2}>
			<UploadPdfField disabled={inProgress}
				fullWidth
				id="certificate"
				label="45L Certificate Preview"
				allowClear={false}
				height={302}
				value={asSrc(pdfs.certificate45L)}
				onChange={handleValueChange}
				inProgress={inProgress}
			/>
		</Stack>
	)
}

export default PdfUpload45LForm