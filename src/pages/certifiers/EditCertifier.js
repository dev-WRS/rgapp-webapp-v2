import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import CertifierForm from 'components/CertifierForm'
import { fetchCertifier, updateCertifier } from 'actions'
import { MSG_TYPE } from 'constants'

const EditCertifier = ({
	selection, 
	onClose	
}) => {
	const dispatch = useDispatch()
	const certifierId = (selection && selection[0]) ? selection[0].id : null
	const certifier = useSelector(state => state.certifiers && state.certifiers.data && 
		certifierId && state.certifiers.data.find(certifier => certifier.id === certifierId))
	const isLoading = useSelector(state => state.certifiers && state.certifiers.isLoading)
	const inProgress = useSelector(state => state.certifiers && state.certifiers.inProgress)

	useEffect(() => {
		if (certifierId) {
			dispatch(fetchCertifier(certifierId))
		}
	}, [certifierId, dispatch])

	const handleSubmit = async ({ licenses, ...state }) => {
		const data = new FormData()

		Object.keys(state).forEach(name => data.append(name, state[name]))
		data.append('licenses', licenses !== '' ? JSON.stringify(licenses) : null)

		const { error } = await dispatch(updateCertifier(certifierId, data))

		if (error) {
			onClose({
				type: MSG_TYPE.error,
				message: error.message
			})
		}
		else {
			onClose({
				type: MSG_TYPE.success,
				message: 'The certifier has been successfully updated'
			})
		}
	}

	const handleCancel = () => {
		onClose && onClose()
	}

	return (
		<CertifierForm
			record={certifier}
			open={true}
			isLoading={isLoading}
			inProgress={inProgress}
			onSubmit={handleSubmit}
			onCancel={handleCancel}
		/>
	)
}

export default EditCertifier