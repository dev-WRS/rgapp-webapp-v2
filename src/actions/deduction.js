import { actionRequest } from 'actions/index'
import * as Types from 'constants/ActionTypes'

export const fetchDeductions = () => async (...args) => {
	const { payload, error, ...others } = await actionRequest(...args)({
		type: Types.FETCH_DEDUCTIONS,
		url: '/deductions',
		method: 'get'
	})

	return { payload, error, ...others }
}