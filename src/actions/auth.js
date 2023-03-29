import { actionRequest, actionRequestCreator } from 'actions/index'
import * as Types from 'constants/ActionTypes'

export const login = (email, password) => async (...args) => {
	const { payload, error, ...others } = await actionRequest(...args)({
		type: Types.REQUEST_LOGIN,
		url: '/login',
		method: 'post',
		data: { email, password }
	})

	return { payload, error, ...others }
}

export const sendCode = (email) => async (...args) => {
	const { payload, error, ...others } = await actionRequest(...args)({
		type: Types.REQUEST_FORGOT_PWD,
		url: '/send-code',
		method: 'post',
		data: { email }
	})

	return { payload, error, ...others }
}

export const emailVerify = (email, secureCode, resetPwdRequired) => async (...args) => {
	const { payload, error, ...others } = await actionRequest(...args)({
		type: Types.REQUEST_EMAIL_VERIFY,
		url: '/email-verify',
		method: 'post',
		data: { email, secureCode, resetPwdRequired }
	})

	return { payload, error, ...others }
}

export const resetPwd = (email, newPassword) => async (...args) => {
	const { payload, error, ...others } = await actionRequest(...args)({
		type: Types.REQUEST_RESET_PWD,
		url: '/reset-password',
		method: 'post',
		data: { email, newPassword }
	})

	return { payload, error, ...others }
}

export const changePwd = (currentPassword, newPassword) => async (...args) => {
	const { payload, error, ...others } = await actionRequest(...args)({
		type: Types.REQUEST_CHANGE_PWD,
		url: '/change-password',
		method: 'post',
		data: { currentPassword, newPassword }
	})

	return { payload, error, ...others }
}

export const logout = () => (dispatch) => {
	return dispatch(actionRequestCreator(Types.REQUEST_LOGOUT, '/logout'))
}