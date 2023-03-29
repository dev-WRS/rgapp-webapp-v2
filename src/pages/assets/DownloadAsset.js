import { useEffect } from 'react'

const DownloadAsset = ({
	selection, 
	onClose	
}) => {
	useEffect(() => {
		if (selection && selection[0]) {
			window.open(`${window.location.origin}/api/assets/${selection[0].id}?download=true`, '_blank').focus()
		}
		onClose && onClose()
	}, [selection, onClose])
}

export default DownloadAsset