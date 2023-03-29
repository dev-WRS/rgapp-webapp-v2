import { useSelector, useDispatch } from 'react-redux'

import CertifierForm from 'components/CertifierForm'
import { createCertifier } from 'actions'
import { MSG_TYPE } from 'constants'

const AddCertifier = ({ 
	onClose
}) => {
	const dispatch = useDispatch()
	const inProgress = useSelector(state => state.certifiers && state.certifiers.inProgress)

	const handleSubmit = async  ({ licenses, ...state }) => {
		const data = new FormData()
		
		Object.keys(state).forEach(name => data.append(name, state[name]))
		data.append('licenses', licenses !== '' ? JSON.stringify(licenses) : null)
		
		const { error } = await dispatch(createCertifier(data))

		if (error) {
			onClose({
				type: MSG_TYPE.error,
				message: error.message
			})
		}
		else {
			onClose({
				type: MSG_TYPE.success,
				message: 'The certifier has been successfully created'
			})
		}
	}

	const handleCancel = () => {
		onClose && onClose()
	}
	
	return (
		<CertifierForm
			open={true}
			inProgress={inProgress}
			onSubmit={handleSubmit}
			onCancel={handleCancel}
		/>
	)
}

export default AddCertifier