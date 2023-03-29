import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import DockedTemplate from 'components/DockedTemplate'
import LoginForm from 'components/LoginForm'
import { login } from 'actions'
import { DEFAULT_ROUTE } from 'constants'

const Login = () => {
	const navigate = useNavigate()
	const dispatch = useDispatch()
	const isLoading = useSelector(state => state.auth && state.auth.inProgress)
	const [errorState, setErrorState] = useState()

	const handleSubmit = async ({ email, password }) => {
		const { error } = await dispatch(login(email, password))

		if (error) {
			setErrorState({ message: error.message })
		}
		else {
			window.location.replace(DEFAULT_ROUTE)
		}
	}

	const handleForgotPwd = () => navigate('/forgot')

	return (
		<DockedTemplate
			formElement={<LoginForm
				error={errorState}
				isLoading={isLoading}
				onSubmit={handleSubmit}
				onForgotPwd={handleForgotPwd}
			/>}
		/>
	)
}
export default Login