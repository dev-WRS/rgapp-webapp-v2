import { actionRequest } from 'actions/index'
import * as Types from 'constants/ActionTypes'

export const fetchAssets = () => async (...args) => {
	const { payload, error, ...others } = await actionRequest(...args)({
		type: Types.FETCH_ASSETS,
		url: '/assets',
		method: 'get'
	})

	return { payload, error, ...others }
}

export const createAsset = (data) => async (...args) => {
	const { payload, error, ...others } = await actionRequest(...args)({
		type: Types.CREATE_ASSET,
		url: '/assets',
		headers: { 'Content-Type': 'multipart/form-data' },
		method: 'post',
		data
	})

	return { payload, error, ...others }
}

export const deleteAsset = (data) => async (...args) => {
	const { payload, error, ...others } = await actionRequest(...args)({
		type: Types.DELETE_ASSET,
		url: '/assets',
		method: 'delete',
		data
	})

	return { payload, error, ...others }
}