import _ from 'lodash'
import Stack from '@mui/material/Stack'

import UploadPdfField from 'components/core/UploadPdfField'

const asSrc = (value) => value ?  `/api/assets/${value}` : ''

const PdfUpload179DForm = ({
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
		<>
			<Stack direction="row" spacing={2}>
				<UploadPdfField disabled={inProgress}
					fullWidth
					id="baseline"
					label="Baseline Design Preview"
					allowClear={false}
					height={150}
					value={asSrc(pdfs.baselineDesign179D)}
					onChange={handleValueChange}
					inProgress={inProgress}
				/>
				<UploadPdfField disabled={inProgress}
					fullWidth
					id="whole"
					label="Whole Building Design Preview"
					allowClear={false}
					height={150}
					value={asSrc(pdfs.wholeBuildingDesign179D)}
					onChange={handleValueChange}
					inProgress={inProgress}
				/>
			</Stack>
			<Stack direction="row" spacing={2}>
				<UploadPdfField disabled={inProgress}
					fullWidth
					id="summary"
					label="Building Summary Preview"
					allowClear={false}
					height={150}
					value={asSrc(pdfs.buildingSummary179D)}
					onChange={handleValueChange}
					inProgress={inProgress}
				/>
				<UploadPdfField disabled={inProgress}
					fullWidth
					id="software"
					label="Software Certificate Preview"
					allowClear={false}
					height={150}
					value={asSrc(pdfs.softwareCertificate179D)}
					onChange={handleValueChange}
					inProgress={inProgress}
				/>
			</Stack>
		</>
	)
}

export default PdfUpload179DForm