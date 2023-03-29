import * as Types from 'constants/ActionTypes'

const lpds = (state = {
	inProgress: false,
	didInvalidate: false,
	data: []
}, action) => {
	switch (action.type) {
		case Types.FETCH_LPDS:
			return Object.assign({}, state, {
				inProgress: true,
				didInvalidate: false
			})
		case Types.FETCH_LPDS_SUCCESS:
			return Object.assign({}, state, {
				inProgress: false,
				didInvalidate: false,
				data: action.payload || [],
				lastUpdated: action.receivedAt
			})
		case Types.FETCH_LPDS_FAILURE:
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

export default lpds