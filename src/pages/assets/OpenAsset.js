import { useEffect } from 'react'

const OpenAsset = ({
	selection, 
	onClose	
}) => {
	useEffect(() => {
		if (selection && selection[0]) {
			const opened = window.open(`${window.location.origin}/api/assets/${selection[0].id}`, '_blank')
			if (opened) opened.focus()
		}
		onClose && onClose()
	}, [selection, onClose])
}

export default OpenAsset