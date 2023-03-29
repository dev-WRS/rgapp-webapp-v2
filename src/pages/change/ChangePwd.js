import { useDispatch, useSelector } from 'react-redux'

import ChangePwdForm from 'components/ChangePwdForm'
import { changePwd } from 'actions'

const ChangePwd = ({ open, onClose }) => {
	const dispatch = useDispatch()
	const isLoading = useSelector(state => state.auth && state.auth.inProgress)

	const handleSubmit = async ({ password, newPassword }) => {
		const { error, payload } = await dispatch(changePwd(password, newPassword))
		onClose && onClose(error ? {
			type: 'error',
			text: error.message
		} : {
			type: 'success',
			text: payload.message
		})
	}

	const handleCancel = () => {
		onClose && onClose()
	}

	return (
		<ChangePwdForm
			open={open}
			// onClose={onClose}
			isLoading={isLoading}
			onSubmit={handleSubmit}
			onCancel={handleCancel}
		/>
	)
}

export default ChangePwd