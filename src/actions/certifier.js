import { actionRequest } from 'actions/index'
import * as Types from 'constants/ActionTypes'

export const fetchCertifiers = () => async (...args) => {
	const { payload, error, ...others } = await actionRequest(...args)({
		type: Types.FETCH_CERTIFIERS,
		url: '/certifiers',
		method: 'get'
	})

	return { payload, error, ...others }
}

export const fetchCertifiersByState = (state) => async (...args) => {
	const { payload, error, ...others } = await actionRequest(...args)({
		type: Types.FETCH_CERTIFIERS,
		url: `/certifiers?state=${state}`,
		method: 'get'
	})

	return { payload, error, ...others }
}

export const fetchCertifier = (id) => async (...args) => {
	const { payload, error, ...others } = await actionRequest(...args)({
		type: Types.FETCH_CERTIFIER,
		url: `/certifiers/${id}`,
		method: 'get'
	})

	return { payload, error, ...others }
}

export const createCertifier = (data) => async (...args) => {
	const { payload, error, ...others } = await actionRequest(...args)({
		type: Types.CREATE_CERTIFIER,
		url: '/certifiers',
		headers: { 'Content-Type': 'multipart/form-data' },
		method: 'post',
		data
	})

	return { payload, error, ...others }
}

export const updateCertifier = (id, data) => async (...args) => {
	const { payload, error, ...others } = await actionRequest(...args)({
		type: Types.UPDATE_CERTIFIER,
		url: `/certifiers/${id}`,
		headers: { 'Content-Type': 'multipart/form-data' },
		method: 'put',
		data
	})

	return { payload, error, ...others }
}

export const deleteCertifier = (id) => async (...args) => {
	const { payload, error, ...others } = await actionRequest(...args)({
		type: Types.DELETE_CERTIFIER,
		url: `/certifiers/${id}`,
		method: 'delete'
	})

	return { payload, error, ...others }
}