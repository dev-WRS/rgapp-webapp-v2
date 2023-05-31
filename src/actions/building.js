import { actionRequest } from 'actions/index'
import * as Types from 'constants/ActionTypes'

export const fetchBuildings = (id) => async (...args) => {
	const { payload, error, ...others } = await actionRequest(...args)({
		type: Types.FETCH_BUILDINGS,
		url: `/projects/${id}/buildings`,
		method: 'get'
	})

	return { payload, error, ...others }
}

export const fetchBuilding = (id, unitId) => async (...args) => {
	const { payload, error, ...others } = await actionRequest(...args)({
		type: Types.FETCH_BUILDING,
		url: `/projects/${id}/buildings/${unitId}`,
		method: 'get'
	})

	return { payload, error, ...others }
}

export const createBuilding = (id, data) => async (...args) => {
	const { payload, error, ...others } = await actionRequest(...args)({
		type: Types.CREATE_BUILDING,
		url: `/projects/${id}/buildings`,
		method: 'post',
		data
	})

	return { payload, error, ...others }
}

export const copyBuilding = (id, buildingId) => async (...args) => {
	const { payload, error, ...others } = await actionRequest(...args)({
		type: Types.COPY_BUILDING,
		url: `/projects/${id}/buildings/${buildingId}/copy`,
		headers: { 'Content-Type': 'application/json' },
		method: 'post',
		data: {id, buildingId}
	})

	return { payload, error, ...others }
}

export const updateBuilding = (id, buildingId, data) => async (...args) => {
	const { payload, error, ...others } = await actionRequest(...args)({
		type: Types.UPDATE_BUILDING,
		url: `/projects/${id}/buildings/${buildingId}`,
		method: 'put',
		data
	})

	return { payload, error, ...others }
}

export const deleteBuilding = (id, data) => async (...args) => {
	const { payload, error, ...others } = await actionRequest(...args)({
		type: Types.DELETE_BUILDING,
		url: `/projects/${id}/buildings`,
		method: 'delete',
		data
	})

	return { payload, error, ...others }
}