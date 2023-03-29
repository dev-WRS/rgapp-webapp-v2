import * as Types from 'constants/ActionTypes'

const assets = (state = {
    inProgress: false, 
    didInvalidate: false,
    data: []
}, action) => {
	switch (action.type) {
		case Types.FETCH_ASSETS:
			return Object.assign({}, state, {
				inProgress: false,
				isLoading: true,
				didInvalidate: false
			})
		case Types.CREATE_ASSET:
		case Types.DELETE_ASSET:
			return Object.assign({}, state, {
				inProgress: true,
				isLoading: false,
				didInvalidate: false
			})
		case Types.FETCH_ASSETS_SUCCESS:
			return Object.assign({}, state, {
				inProgress: false,
				isLoading: false,
				didInvalidate: false,
				data: action.payload || [],
				lastUpdated: action.receivedAt
			})
		case Types.CREATE_ASSET_SUCCESS:
			return Object.assign({}, state, {
				inProgress: false,
				isLoading: false,
				didInvalidate: false,
				data: [...state.data, { ...action.payload }],
				lastUpdated: action.receivedAt
			})
		case Types.DELETE_ASSET_SUCCESS:
			state.data = state.data.filter((item) => {
				return item.id !== action.payload.id
			})
			
			return Object.assign({}, state, {
				inProgress: false,
				isLoading: false,
				didInvalidate: false,
				data: [...state.data],
				lastUpdated: action.receivedAt
			})
		case Types.FETCH_ASSETS_FAILURE:
		case Types.CREATE_ASSET_FAILURE:
		case Types.DELETE_ASSET_FAILURE:
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

export default assets