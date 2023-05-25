import { actionRequest } from 'actions/index'
import * as Types from 'constants/ActionTypes'

export const fetchProjects = () => async (...args) => {
	const { payload, error, ...others } = await actionRequest(...args)({
		type: Types.FETCH_PROJECTS,
		url: '/projects',
		method: 'get'
	})

	return { payload, error, ...others }
}

export const fetchProjectInfo = (projectID) => async (...args) => {
	const { payload, error, ...others } = await actionRequest(...args)({
		type: Types.FETCH_PROJECT_INFO,
		url: `/projects/${projectID}/lookup`,
		method: 'get'
	})

	return { payload, error, ...others }
}

export const fetchProject = (id) => async (...args) => {
	const { payload, error, ...others } = await actionRequest(...args)({
		type: Types.FETCH_PROJECT,
		url: `/projects/${id}`,
		method: 'get'
	})

	return { payload, error, ...others }
}

export const createProject = (data) => async (...args) => {
	const { payload, error, ...others } = await actionRequest(...args)({
		type: Types.CREATE_PROJECT,
		url: '/projects',
		method: 'post',
		data
	})

	return { payload, error, ...others }
}

export const copyProject = (id) => async (...args) => {
	const { payload, error, ...others } = await actionRequest(...args)({
		type: Types.COPY_PROJECT,
		url: `/projects/${id}/copy`,
		headers: { 'Content-Type': 'application/json' },
		method: 'post',
		data: { id }
	})

	return { payload, error, ...others }
}

export const updateProject = (id, data) => async (...args) => {
	const { payload, error, ...others } = await actionRequest(...args)({
		type: Types.UPDATE_PROJECT,
		url: `/projects/${id}`,
		method: 'put',
		data
	})

	return { payload, error, ...others }
}

export const updateProjectStatus = (id, data) => async (...args) => {
	const { payload, error, ...others } = await actionRequest(...args)({
		type: Types.UPDATE_PROJECT_STATUS,
		url: `/projects/${id}/status`,
		method: 'put',
		data
	})

	return { payload, error, ...others }
}

export const updateProjectDwellingUnit = (id, data) => async (...args) => {
	const { payload, error, ...others } = await actionRequest(...args)({
		type: Types.UPDATE_PROJECT_DWELLING_UNIT,
		url: `/projects/${id}/dwellingUnit`,
		method: 'put',
		data
	})

	return { payload, error, ...others }
}

export const updateProjectCertifier = (id, data) => async (...args) => {
	const { payload, error, ...others } = await actionRequest(...args)({
		type: Types.UPDATE_PROJECT_CERTIFIER,
		url: `/projects/${id}/certifier`,
		method: 'put',
		data
	})

	return { payload, error, ...others }
}

export const updateProjectCustomer = (id, data) => async (...args) => {
	const { payload, error, ...others } = await actionRequest(...args)({
		type: Types.UPDATE_PROJECT_CUSTOMER,
		url: `/projects/${id}/customer`,
		method: 'put',
		data
	})

	return { payload, error, ...others }
}

export const deleteProject = (id) => async (...args) => {
	const { payload, error, ...others } = await actionRequest(...args)({
		type: Types.DELETE_PROJECT,
		url: `/projects/${id}`,
		method: 'delete'
	})

	return { payload, error, ...others }
}

export const createProjectPhoto = (id, data) => async (...args) => {
	const { payload, error, ...others } = await actionRequest(...args)({
		type: Types.CREATE_PROJECT_PHOTO,
		url: `/projects/${id}/photos`,
		headers: { 'Content-Type': 'multipart/form-data' },
		method: 'post',
		data
	})

	return { payload, error, ...others }
}

export const updateProjectPhoto = (id, { id: photoId, description }) => async (...args) => {
	const { payload, error, ...others } = await actionRequest(...args)({
		type: Types.UPDATE_PROJECT_PHOTO,
		url: `/projects/${id}/photos/${photoId}`,
		method: 'put',
		data: { description }
	})

	return { payload, error, ...others }
}

export const deleteProjectPhoto = (id, photoId) => async (...args) => {
	const { payload, error, ...others } = await actionRequest(...args)({
		type: Types.DELETE_PROJECT_PHOTO,
		url: `/projects/${id}/photos/${photoId}`,
		method: 'delete'
	})

	return { payload, error, ...others }
}

const mapping = {
	certificate: 'certificate45L',
	baseline: 'baselineDesign179D',
	whole: 'wholeBuildingDesign179D',
	summary: 'buildingSummary179D',
	software: 'softwareCertificate179D'
}

export const updateProjectPdf = (id, name, data) => async (...args) => {
	const { payload, error, ...others } = await actionRequest(...args)({
		type: Types.UPDATE_PROJECT_PDF,
		url: `/projects/${id}/${mapping[name]}`,
		headers: { 'Content-Type': 'multipart/form-data' },
		method: 'put',
		data
	})

	return { payload, error, ...others }
}

export const generateProjectReport = (id) => async (...args) => {
	const { payload, error, ...others } = await actionRequest(...args)({
		type: Types.GENERATE_PROJECT_REPORT,
		url: `/projects/${id}/report`,
		method: 'put'
	})

	return { payload, error, ...others }
}