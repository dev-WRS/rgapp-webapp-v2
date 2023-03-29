import * as Types from 'constants/ActionTypes'

const customers = (state = {
    inProgress: false, 
    didInvalidate: false,
    data: []
}, action) => {
	switch (action.type) {
		case Types.FETCH_CUSTOMERS:
		case Types.FETCH_CUSTOMER:
			return Object.assign({}, state, {
				inProgress: false,
				isLoading: true,
				didInvalidate: false
			})
		case Types.CREATE_CUSTOMER:
		case Types.UPDATE_CUSTOMER:
			return Object.assign({}, state, {
				inProgress: true,
				isLoading: false,
				didInvalidate: false
			})
		case Types.FETCH_CUSTOMERS_SUCCESS:
			return Object.assign({}, state, {
				inProgress: false,
				isLoading: false,
				didInvalidate: false,
				data: action.payload || [],
				lastUpdated: action.receivedAt
			})
		case Types.CREATE_CUSTOMER_SUCCESS:
			return Object.assign({}, state, {
				inProgress: false,
				isLoading: false,
				didInvalidate: false,
				data: [...state.data, { ...action.payload }],
				lastUpdated: action.receivedAt
			})
		case Types.FETCH_CUSTOMER_SUCCESS:
		case Types.UPDATE_CUSTOMER_SUCCESS:
			state.data = state.data.map(item => (item.id === action.payload.id ? { ...action.payload } : item))
			
			return Object.assign({}, state, {
				inProgress: false,
				isLoading: false,
				didInvalidate: false,
				data: [...state.data],
				lastUpdated: action.receivedAt
			})
		case Types.FETCH_CUSTOMERS_FAILURE:
		case Types.FETCH_CUSTOMER_FAILURE:
		case Types.CREATE_CUSTOMER_FAILURE:
		case Types.UPDATE_CUSTOMER_FAILURE:
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

export default customers