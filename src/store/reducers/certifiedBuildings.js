import * as Types from 'constants/ActionTypes';

const certifiedBuildings = (
	state = {
		inProgress: false,
		didInvalidate: false,
		data: [],
	},
	action
) => {
	switch (action.type) {
		case Types.FETCH_PROJECT_CERTIFIED_BUILDINGS:
		case Types.FETCH_PROJECT_CERTIFIED_BUILDING:
			return Object.assign({}, state, {
				inProgress: false,
				isLoading: true,
				didInvalidate: false,
			});
		case Types.FETCH_PROJECT_CERTIFIED_BUILDINGS_SUCCESS:
			return Object.assign({}, state, {
				inProgress: false,
				isLoading: false,
				didInvalidate: false,
				data: action.payload || [],
				lastUpdated: action.receivedAt,
			});
		default:
			return state;
	}
};

export default certifiedBuildings;
