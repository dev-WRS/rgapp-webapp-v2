import { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'

import DockedTemplate from 'components/DockedTemplate'
import EmailVerifyForm from 'components/EmailVerifyForm'
import { sendCode, emailVerify } from 'actions'

const EmailVerify = () => {
	const location = useLocation()
	const navigate = useNavigate()
	const dispatch = useDispatch()
	const email = useMemo(() => {
		if (location.state && location.state['email']) {
			return location.state['email']
		}
		else if (location.search) {
			const params = new URLSearchParams(location.search)
			return params.get('email')
		}
		return
	}, [location])
	const isLoading = useSelector(state => state.auth && state.auth.inProgress)
	const [messageState, setMessageState] = useState()

	const handleResendCode = async () => {
		if (email) {
			const { error, payload } = await dispatch(sendCode(email))

			if (!error && payload && payload.message) {
				setMessageState({
					type: 'success',
					text: payload.message 
				})
			}
			else {
				setMessageState({
					type: 'error',
					text: error.message 
				})
			}
		}
	}
	const handleSubmit = async ({ code }) => {
		const { error } = await dispatch(emailVerify(email, code, true))
		
		if (!error) {
			navigate('/reset', { state: { email } })
		}
		else {
			setMessageState({
				type: 'error',
				text: error.message 
			})
		}
		
	}

	const handleCancel = () => navigate(-1)

	return (
		<DockedTemplate
			formElement={<EmailVerifyForm
				message={messageState}
				isLoading={isLoading}
				onResendCode={handleResendCode}
				onSubmit={handleSubmit}
				onCancel={handleCancel}
			/>}
		/>
	)
}
export default EmailVerify