import * as Types from 'constants/ActionTypes'

const deductions = (state = {
	inProgress: false,
	didInvalidate: false,
	data: []
}, action) => {
	switch (action.type) {
		case Types.FETCH_DEDUCTIONS:
			return Object.assign({}, state, {
				inProgress: true,
				didInvalidate: false
			})
		case Types.FETCH_DEDUCTIONS_SUCCESS:
			return Object.assign({}, state, {
				inProgress: false,
				didInvalidate: false,
				data: action.payload || [],
				lastUpdated: action.receivedAt
			})
		case Types.FETCH_DEDUCTIONS_FAILURE:
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

export default deductions