import * as Types from 'constants/ActionTypes'

const actions = (state = {
    inProgress: false, 
    didInvalidate: false,
    data: []
}, action) => {
	switch (action.type) {
		case Types.FETCH_ACTIONS:
			return Object.assign({}, state, {
				inProgress: true,
				didInvalidate: false
			})
		case Types.FETCH_ACTIONS_SUCCESS:
			return Object.assign({}, state, {
				inProgress: false,
				didInvalidate: false,
				data: action.payload || [],
				lastUpdated: action.receivedAt
			})
		case Types.FETCH_ACTIONS_FAILURE:
			return Object.assign({}, state, {
				inProgress: false,
				didInvalidate: false,
				data: null,
				lastUpdated: action.receivedAt
			})
		default:
			return state
		}
}

export default actions