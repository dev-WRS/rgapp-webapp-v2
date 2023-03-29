import { actionRequest } from 'actions/index'
import * as Types from 'constants/ActionTypes'

export const fetchActions = () => async (...args) => {
	const { payload, error, ...others } = await actionRequest(...args)({
		type: Types.FETCH_ACTIONS,
		url: '/actions',
		method: 'get'
	})

	return { payload, error, ...others }
}