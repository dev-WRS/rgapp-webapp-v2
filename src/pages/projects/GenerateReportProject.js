/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import LoadingMask from 'components/core/LoadingMask'

import { generateProjectReport } from 'actions'
import { MSG_TYPE } from 'constants'

const GenerateReportProject = ({
	selection, 
	onClose	
}) => {
	const dispatch = useDispatch()
	const [openMask, setOpenMask] = useState(false)

	useEffect(() => {
		const generate = async () => {
			try {
				setOpenMask(true)
				const { error } = await dispatch(generateProjectReport(selection[0].id))
				setOpenMask(false)

				if (error) {
					onClose({
						type: MSG_TYPE.error,
						message: error.message
					})
				}
				else {
					onClose({
						type: MSG_TYPE.success,
						message: 'The report has been successfully generated'
					})
				}
			}
			catch (error) {
				onClose({
					type: MSG_TYPE.error,
					message: error.message
				})	
			}
			finally {
				setOpenMask(false)
			}
		}
		
		generate()
	}, [dispatch, selection])

	return (
		<LoadingMask
			color="#FFFFFF"
			open={openMask}
			loadingText="Please wait ..."
		/>
	)
}

export default GenerateReportProject