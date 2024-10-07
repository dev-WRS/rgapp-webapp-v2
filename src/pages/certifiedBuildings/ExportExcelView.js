import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'

import MessageDialog from 'components/core/MessageDialog'
import { MSG_TYPE } from 'constants'
import { getCertifiedBuildingToExport } from 'actions';
import { exportToExcelCertifiedBuilding } from './exportExcel';

const ExportExcelView = ({
	selection,
	onClose
}) => {
	const dispatch = useDispatch()
	const [open, setOpen] = useState(true)
	const inProgress = useSelector(state => state.projects && state.projects.inProgress)

	const handleCancel = () => {
		setOpen(false)
		onClose && onClose()
	}

	const handleConfirm = async () => {
		const { payload, error } = await dispatch(getCertifiedBuildingToExport(selection[0].id));

		setOpen(false);

		if (error) {
			onClose({
				type: MSG_TYPE.error,
				message: error.message
			});
		} else {
			await exportToExcelCertifiedBuilding(payload);
			onClose({
				type: MSG_TYPE.success,
				message: 'The certified building excel information has been exported successfully'
			});
		}
	}

	return (
		<MessageDialog open={open}
			color="warning"
			title="Export certified building Excel file?"
			description="Certified building from selected project will be exported to Excel file."
			confirmText="Export Excel"
			inProgress={inProgress}
			onCancel={handleCancel}
			onConfirm={handleConfirm}
		/>
	)
}

export default ExportExcelView