import { actionRequest } from 'actions/index'
import * as Types from 'constants/ActionTypes'

export const fetchUsers = () => async (...args) => {
	const { payload, error, ...others } = await actionRequest(...args)({
		type: Types.FETCH_USERS,
		url: '/users',
		method: 'get'
	})

	return { payload, error, ...others }
}


export const fetchUser = (id) => async (...args) => {
	const { payload, error, ...others } = await actionRequest(...args)({
		type: Types.FETCH_USER,
		url: `/users/${id}`,
		method: 'get'
	})

	return { payload, error, ...others }
}

export const createUser = ({ name, email, phone, role }) => async (...args) => {
	const { payload, error, ...others } = await actionRequest(...args)({
		type: Types.CREATE_USER,
		url: '/users',
		method: 'post',
		data: { name, email, phone, role }
	})

	return { payload, error, ...others }
}

export const updateUser = ({ id, name, phone, role }) => async (...args) => {
	const { payload, error, ...others } = await actionRequest(...args)({
		type: Types.UPDATE_USER,
		url: `/users/${id}`,
		method: 'put',
		data: { name, phone, role }
	})

	return { payload, error, ...others }
}

export const activateUser = (id) => async (...args) => {
	const { payload, error, ...others } = await actionRequest(...args)({
		type: Types.ACTIVATE_USER,
		url: `/users/${id}/activate`,
		method: 'put'
	})

	return { payload, error, ...others }
}

export const deactivateUser = (id) => async (...args) => {
	const { payload, error, ...others } = await actionRequest(...args)({
		type: Types.DEACTIVATE_USER,
		url: `/users/${id}/deactivate`,
		method: 'put'
	})

	return { payload, error, ...others }
}

export const deleteUser = (id) => async (...args) => {
	const { payload, error, ...others } = await actionRequest(...args)({
		type: Types.DELETE_USER,
		url: `/users/${id}`,
		method: 'delete'
	})

	return { payload, error, ...others }
}