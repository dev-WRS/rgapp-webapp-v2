import * as Types from 'constants/ActionTypes'

const roles = (state = {
    inProgress: false, 
    didInvalidate: false,
    data: []
}, action) => {
	switch (action.type) {
		case Types.FETCH_ROLE:
		case Types.UPDATE_ROLE:
			return Object.assign({}, state, {
				inProgress: true,
				didInvalidate: false
			})
		case Types.FETCH_ROLE_SUCCESS:
		case Types.UPDATE_ROLE_SUCCESS:
			state.data = state.data.map(item => (action.payload && item.id === action.payload.id ? { ...action.payload } : item))
			return Object.assign({}, state, {
				inProgress: false,
				didInvalidate: false,
				data: [...state.data],
				lastUpdated: action.receivedAt
			})
		case Types.FETCH_ROLE_FAILURE:
		case Types.UPDATE_ROLE_FAILURE:
			return Object.assign({}, state, {
				inProgress: false,
				didInvalidate: false,
				lastUpdated: action.receivedAt
			})
		default:
			return state
		}
}

export default roles