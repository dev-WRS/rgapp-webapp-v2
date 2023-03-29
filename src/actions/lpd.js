import { actionRequest } from 'actions/index'
import * as Types from 'constants/ActionTypes'

export const fetchLpds = () => async (...args) => {
	const { payload, error, ...others } = await actionRequest(...args)({
		type: Types.FETCH_LPDS,
		url: '/lpds',
		method: 'get'
	})

	return { payload, error, ...others }
}