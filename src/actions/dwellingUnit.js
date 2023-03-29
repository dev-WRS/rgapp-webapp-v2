import { actionRequest } from 'actions/index'
import * as Types from 'constants/ActionTypes'

export const fetchDwellingUnits = (id) => async (...args) => {
	const { payload, error, ...others } = await actionRequest(...args)({
		type: Types.FETCH_DWELLING_UNITS,
		url: `/projects/${id}/dwellingUnits`,
		method: 'get'
	})

	return { payload, error, ...others }
}

export const fetchDwellingUnit = (id, unitId) => async (...args) => {
	const { payload, error, ...others } = await actionRequest(...args)({
		type: Types.FETCH_DWELLING_UNIT,
		url: `/projects/${id}/dwellingUnits/${unitId}`,
		method: 'get'
	})

	return { payload, error, ...others }
}

export const createDwellingUnit = (id, data) => async (...args) => {
	const { payload, error, ...others } = await actionRequest(...args)({
		type: Types.CREATE_DWELLING_UNIT,
		url: `/projects/${id}/dwellingUnits`,
		method: 'post',
		data
	})

	return { payload, error, ...others }
}

export const updateDwellingUnit = (id, unitId, data) => async (...args) => {
	const { payload, error, ...others } = await actionRequest(...args)({
		type: Types.UPDATE_DWELLING_UNIT,
		url: `/projects/${id}/dwellingUnits/${unitId}`,
		method: 'put',
		data
	})

	return { payload, error, ...others }
}

export const deleteDwellingUnit = (id, data) => async (...args) => {
	const { payload, error, ...others } = await actionRequest(...args)({
		type: Types.DELETE_DWELLING_UNIT,
		url: `/projects/${id}/dwellingUnits`,
		method: 'delete',
		data
	})

	return { payload, error, ...others }
}