import * as Types from 'constants/ActionTypes'

const users = (state = {
    inProgress: false, 
    didInvalidate: false,
    data: []
}, action) => {
	switch (action.type) {
		case Types.FETCH_USERS:
		case Types.FETCH_USER:
			return Object.assign({}, state, {
				inProgress: false,
				isLoading: true,
				didInvalidate: false
			})
		case Types.CREATE_USER:
		case Types.UPDATE_USER:
		case Types.ACTIVATE_USER:
		case Types.DEACTIVATE_USER:
			return Object.assign({}, state, {
				inProgress: true,
				isLoading: false,
				didInvalidate: false
			})
		case Types.FETCH_USERS_SUCCESS:
			return Object.assign({}, state, {
				inProgress: false,
				isLoading: false,
				didInvalidate: false,
				data: action.payload || [],
				lastUpdated: action.receivedAt
			})
		case Types.CREATE_USER_SUCCESS:
			return Object.assign({}, state, {
				inProgress: false,
				isLoading: false,
				didInvalidate: false,
				lastUpdated: action.receivedAt
			})
		case Types.FETCH_USER_SUCCESS:
		case Types.UPDATE_USER_SUCCESS:
		case Types.ACTIVATE_USER_SUCCESS:
		case Types.DEACTIVATE_USER_SUCCESS:
			state.data = state.data.map(item => (item.id === action.payload.id ? { ...action.payload } : item))
			
			return Object.assign({}, state, {
				inProgress: false,
				isLoading: false,
				didInvalidate: false,
				data: [...state.data],
				lastUpdated: action.receivedAt
			})
		case Types.FETCH_USERS_FAILURE:
		case Types.FETCH_USER_FAILURE:
		case Types.CREATE_USER_FAILURE:
		case Types.UPDATE_USER_FAILURE:
		case Types.ACTIVATE_USER_FAILURE:
		case Types.DEACTIVATE_USER_FAILURE:
			return Object.assign({}, state, {
				inProgress: false,
				isLoading: false,
				didInvalidate: false,
				lastUpdated: action.receivedAt
			})
		default:
			return state
		}
}

export default users