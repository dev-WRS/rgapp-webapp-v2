import * as Types from 'constants/ActionTypes'

const auth = (state = {
	inProgress: false,
	didInvalidate: false,
	data: null
}, action) => {
	switch (action.type) {
	case Types.REQUEST_LOGIN:
	case Types.REQUEST_FORGOT_PWD:
	case Types.REQUEST_EMAIL_VERIFY:
	case Types.REQUEST_RESET_PWD:
	case Types.REQUEST_CHANGE_PWD:
		return Object.assign({}, state, {
			inProgress: true,
			didInvalidate: false
		})
	case Types.REQUEST_LOGIN_SUCCESS:
	case Types.REQUEST_FORGOT_PWD_SUCCESS:
	case Types.REQUEST_EMAIL_VERIFY_SUCCESS:
		return Object.assign({}, state, {
			inProgress: false,
			didInvalidate: false,
			// data: (action.payload && action.payload.data) ? { ...action.payload.data } : null,
			data: (action.payload) ? { ...action.payload } : null,
			lastUpdated: action.receivedAt
		})
	case Types.REQUEST_CHANGE_PWD_SUCCESS:
	case Types.REQUEST_CHANGE_PWD_FAILURE:
		return Object.assign({}, state, {
			inProgress: false,
			didInvalidate: false,
			lastUpdated: action.receivedAt
		})
	case Types.REQUEST_RESET_PWD_SUCCESS:
		delete state.data.resetPwdRequired
		return Object.assign({}, state, {
			inProgress: false,
			didInvalidate: false,
			data: { ...state.data },
			lastUpdated: action.receivedAt
		})
	case Types.REQUEST_LOGOUT:
		return Object.assign({}, state, {
			inProgress: false,
			didInvalidate: false,
			data: null,
			lastUpdated: action.receivedAt
		})
	case Types.REQUEST_LOGIN_FAILURE:
	case Types.REQUEST_FORGOT_PWD_FAILURE:
	case Types.REQUEST_EMAIL_VERIFY_FAILURE:
	case Types.REQUEST_RESET_PWD_FAILURE:
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

export default auth