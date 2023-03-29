import { useEffect } from 'react'

const OpenReportProject = ({
	selection, 
	onClose	
}) => {
	useEffect(() => {
		if (selection && selection[0] && selection[0].report) {
			const opened = window.open(`${window.location.origin}/api/assets/${selection[0].report}`, '_blank')
			if (opened) opened.focus()
		}
		onClose && onClose()
	}, [selection, onClose])
}

export default OpenReportProject
