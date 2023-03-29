import * as Types from 'constants/ActionTypes'

const certifiers = (state = {
    inProgress: false, 
    didInvalidate: false,
    data: []
}, action) => {
	switch (action.type) {
		case Types.FETCH_CERTIFIERS:
		case Types.FETCH_CERTIFIER:
			return Object.assign({}, state, {
				inProgress: false,
				isLoading: true,
				didInvalidate: false
			})
		case Types.CREATE_CERTIFIER:
		case Types.UPDATE_CERTIFIER:
			return Object.assign({}, state, {
				inProgress: true,
				isLoading: false,
				didInvalidate: false
			})
		case Types.FETCH_CERTIFIERS_SUCCESS:
			return Object.assign({}, state, {
				inProgress: false,
				isLoading: false,
				didInvalidate: false,
				data: action.payload || [],
				lastUpdated: action.receivedAt
			})
		case Types.CREATE_CERTIFIER_SUCCESS:
			return Object.assign({}, state, {
				inProgress: false,
				isLoading: false,
				didInvalidate: false,
				data: [...state.data, { ...action.payload }],
				lastUpdated: action.receivedAt
			})
		case Types.FETCH_CERTIFIER_SUCCESS:
		case Types.UPDATE_CERTIFIER_SUCCESS:
			state.data = state.data.map(item => (item.id === action.payload.id ? { ...action.payload } : item))
			
			return Object.assign({}, state, {
				inProgress: false,
				isLoading: false,
				didInvalidate: false,
				data: [...state.data],
				lastUpdated: action.receivedAt
			})
		case Types.FETCH_CERTIFIERS_FAILURE:
		case Types.FETCH_CERTIFIER_FAILURE:
		case Types.CREATE_CERTIFIER_FAILURE:
		case Types.UPDATE_CERTIFIER_FAILURE:
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

export default certifiers