import { useEffect } from 'react'

const DownloadReportProject = ({
	selection, 
	onClose	
}) => {
	useEffect(() => {
		if (selection && selection[0] && selection[0].report) {
			window.open(`${window.location.origin}/api/assets/${selection[0].report}?download=true`, '_blank').focus()
		}
		onClose && onClose()
	}, [selection, onClose])
}

export default DownloadReportProject
