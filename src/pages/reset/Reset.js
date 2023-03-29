import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'

import DockedTemplate from 'components/DockedTemplate'
import ResetPwdForm from 'components/ResetPwdForm'
import { resetPwd } from 'actions'
import { DEFAULT_ROUTE } from 'constants'

const Reset = () => {
	const location = useLocation()
	const navigate = useNavigate()
	const dispatch = useDispatch()
	const isLoading = useSelector(state => state.auth && state.auth.inProgress)
	const [errorState, setErrorState] = useState()

	const handleSubmit = async ({ newPassword }) => {
		if (location.state && location.state.email) {
			const { error } = await dispatch(resetPwd(location.state.email, newPassword))
			
			if (error) {
				setErrorState({ message: error.message })
			}
			else {
				window.location.replace(DEFAULT_ROUTE)
			}
		}
	}

	const handleCancel = () => navigate(-1)

	return (
		<DockedTemplate
			formElement={<ResetPwdForm
				error={errorState}
				isLoading={isLoading}
				onSubmit={handleSubmit}
				onCancel={handleCancel}
			/>}
		/>
	)
}
export default Reset