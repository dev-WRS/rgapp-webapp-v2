import { actionRequest } from 'actions/index'
import * as Types from 'constants/ActionTypes'

export const fetchCustomers = () => async (...args) => {
	const { payload, error, ...others } = await actionRequest(...args)({
		type: Types.FETCH_CUSTOMERS,
		url: '/customers',
		method: 'get'
	})

	return { payload, error, ...others }
}


export const fetchCustomer = (id) => async (...args) => {
	const { payload, error, ...others } = await actionRequest(...args)({
		type: Types.FETCH_CUSTOMER,
		url: `/customers/${id}`,
		method: 'get'
	})

	return { payload, error, ...others }
}

export const createCustomer = (data) => async (...args) => {
	const { payload, error, ...others } = await actionRequest(...args)({
		type: Types.CREATE_CUSTOMER,
		url: '/customers',
		headers: { 'Content-Type': 'multipart/form-data' },
		method: 'post',
		data
	})

	return { payload, error, ...others }
}

export const updateCustomer = (id, data) => async (...args) => {
	const { payload, error, ...others } = await actionRequest(...args)({
		type: Types.UPDATE_CUSTOMER,
		url: `/customers/${id}`,
		headers: { 'Content-Type': 'multipart/form-data' },
		method: 'put',
		data
	})

	return { payload, error, ...others }
}

export const deleteCustomer = (id) => async (...args) => {
	const { payload, error, ...others } = await actionRequest(...args)({
		type: Types.DELETE_CUSTOMER,
		url: `/customers/${id}`,
		method: 'delete'
	})

	return { payload, error, ...others }
}