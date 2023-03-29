import { actionRequest } from 'actions/index'
import * as Types from 'constants/ActionTypes'

export const fetchRole = (id) => async (...args) => {
	const { payload, error, ...others } = await actionRequest(...args)({
		type: Types.FETCH_ROLE,
		url: `/roles/${id}`,
		method: 'get'
	})

	return { payload, error, ...others }
}

export const updateRole = (role) => async (...args) => {
	const { payload, error, ...others } = await actionRequest(...args)({
		type: Types.UPDATE_ROLE,
		url: `/roles/${role.id}`,
		method: 'put',
		data: { actions: role.actions }
	})

	return { payload, error, ...others }
}