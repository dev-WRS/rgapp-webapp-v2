import { cancelableRequest } from 'http/request'

const requestId = value => value.substring(1, value.length)

export const actionRequestCreator = (type, id) => ({ type, id })
export const actionSuccessCreator = (type, id, payload) => ({
	type: `${type}_SUCCESS`,
	id, payload,
	receivedAt: Date.now()
})
export const actionFailureCreator = (type, id, error) => ({
	type: `${type}_FAILURE`,
	id, error,
	receivedAt: Date.now()
})

// export const actionRequest = (dispatch, getState) => ({ type, url, method, headers, ...args }) => {
export const actionRequest = (dispatch) => ({ type, url, method, ...args }) => {
	// const { auth } = (getState) ? getState() : {}
	const id = requestId(url)

	dispatch(actionRequestCreator(type, id))
	
	// return cancelableRequest(Object.assign({ url, method, ...args }, {
	// 	headers: Object.assign((auth && auth.data) ? { 'Authorization': `Bearer ${auth.data.token}` } : {}, headers || {})
	// }))
	return cancelableRequest({ id, url, method, ...args })
		.then(result => {
			return dispatch(actionSuccessCreator(type, id, result))
		})
		.catch(error => dispatch(actionFailureCreator(type, id, error)))
}

export * from './auth'
export * from './asset'
export * from './user'
export * from './action'
export * from './role'
export * from './customer'
export * from './certifier'
export * from './project'
export * from './deduction'
export * from './lpd'
export * from './building'
export * from './dwellingUnit'