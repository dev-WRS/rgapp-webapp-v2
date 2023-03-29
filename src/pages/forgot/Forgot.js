import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import DockedTemplate from 'components/DockedTemplate'
import ForgotPwdForm from 'components/ForgotPwdForm'
import { sendCode } from 'actions'

const Forgot = () => {
	const navigate = useNavigate()
	const dispatch = useDispatch()
	const isLoading = useSelector(state => state.auth && state.auth.inProgress)
	const [errorState, setErrorState] = useState()

	const handleSubmit = async ({ email }) => {
		const { error } = await dispatch(sendCode(email))

		if (!error) {
			navigate('/verify', { state: { email } })
		}
		else {
			setErrorState({
				message: error.message 
			})
		}
	}
	const handleCancel = () => navigate(-1)

	return (
		<DockedTemplate
			formElement={<ForgotPwdForm
				error={errorState}
				isLoading={isLoading}
				onSubmit={handleSubmit}
				onCancel={handleCancel}
			/>}
		/>
	)
}
export default Forgot