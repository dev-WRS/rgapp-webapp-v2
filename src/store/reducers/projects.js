import * as Types from 'constants/ActionTypes';

const projects = (state = {
    inProgress: false, 
    didInvalidate: false,
    data: []
}, action) => {
	switch (action.type) {
		case Types.FETCH_PROJECTS:
		case Types.FETCH_PROJECT_CERTIFIED_BUILDINGS:
		case Types.FETCH_PROJECTS_BY_REPORT_DATE:
		case Types.FETCH_PROJECT_INFO:
		case Types.FETCH_PROJECT:
		case Types.FETCH_PROJECT_CERTIFIED_BUILDING:
			return Object.assign({}, state, {
				inProgress: false,
				isLoading: true,
				didInvalidate: false,
			});
		case Types.CREATE_PROJECT:
		case Types.COPY_PROJECT:
		case Types.UPDATE_PROJECT:
		case Types.CREATE_BUILDING:
		case Types.COPY_BUILDING:
		case Types.UPDATE_BUILDING:
		case Types.CREATE_DWELLING_UNIT:
		case Types.UPDATE_DWELLING_UNIT:
		case Types.UPDATE_PROJECT_STATUS:
		case Types.UPDATE_PROJECT_DWELLING_UNIT:
		case Types.UPDATE_PROJECT_CERTIFIER:
		case Types.UPDATE_PROJECT_CUSTOMER:
		case Types.CREATE_PROJECT_PHOTO:
		case Types.UPDATE_PROJECT_PHOTO:
		case Types.UPDATE_PROJECT_PHOTO_CHANGE:
		case Types.DELETE_PROJECT_PHOTO:
		case Types.UPDATE_PROJECT_PDF:
		case Types.GENERATE_PROJECT_REPORT:
		case Types.DELETE_PROJECTS:
		case Types.EXPORT_EXCEL_CERTIFIED_BUILDING:
			return Object.assign({}, state, {
				inProgress: true,
				isLoading: false,
				didInvalidate: false,
			});
		case Types.FETCH_PROJECTS_SUCCESS:
		case Types.FETCH_PROJECTS_BY_REPORT_DATE_SUCCESS:
			return Object.assign({}, state, {
				inProgress: false,
				isLoading: false,
				didInvalidate: false,
				data: action.payload || [],
				lastUpdated: action.receivedAt,
			});
		case Types.FETCH_PROJECT_CERTIFIED_BUILDINGS_SUCCESS:
			return Object.assign({}, state, {
				inProgress: false,
				isLoading: false,
				didInvalidate: false,
				data: action.payload || [],
				lastUpdated: action.receivedAt,
			});
		case Types.CREATE_PROJECT_SUCCESS:
		case Types.COPY_PROJECT_SUCCESS:
		case Types.DELETE_PROJECTS_SUCCESS:
		case Types.EXPORT_EXCEL_CERTIFIED_BUILDING_SUCCESS:
			return Object.assign({}, state, {
				inProgress: false,
				isLoading: false,
				didInvalidate: false,
				data: [...state.data, { ...action.payload }],
				lastUpdated: action.receivedAt,
			});
		case Types.FETCH_PROJECT_SUCCESS:
		case Types.FETCH_PROJECT_INFO_SUCCESS:
		case Types.UPDATE_PROJECT_SUCCESS:
		case Types.UPDATE_PROJECT_STATUS_SUCCESS:
		case Types.UPDATE_PROJECT_DWELLING_UNIT_SUCCESS:
		case Types.UPDATE_PROJECT_CERTIFIER_SUCCESS:
		case Types.UPDATE_PROJECT_CUSTOMER_SUCCESS:
		case Types.CREATE_BUILDING_SUCCESS:
		case Types.COPY_BUILDING_SUCCESS:
		case Types.UPDATE_BUILDING_SUCCESS:
		case Types.DELETE_BUILDING_SUCCESS:
		case Types.CREATE_DWELLING_UNIT_SUCCESS:
		case Types.UPDATE_DWELLING_UNIT_SUCCESS:
		case Types.DELETE_DWELLING_UNIT_SUCCESS:
		case Types.CREATE_PROJECT_PHOTO_SUCCESS:
		case Types.UPDATE_PROJECT_PHOTO_SUCCESS:
		case Types.UPDATE_PROJECT_PHOTO_CHANGE_SUCCESS:
		case Types.DELETE_PROJECT_PHOTO_SUCCESS:
		case Types.UPDATE_PROJECT_PDF_SUCCESS:
		case Types.GENERATE_PROJECT_REPORT_SUCCESS:
			state.data = state.data.map((item) => (item.id === action.payload.id ? { ...action.payload } : item));

			return Object.assign({}, state, {
				inProgress: false,
				isLoading: false,
				didInvalidate: false,
				data: [...state.data],
				lastUpdated: action.receivedAt,
			});
		case Types.FETCH_PROJECTS_FAILURE:
		case Types.FETCH_PROJECTS_BY_REPORT_DATE_FAILURE:
		case Types.FETCH_PROJECT_FAILURE:
		case Types.FETCH_PROJECT_INFO_FAILURE:
		case Types.CREATE_PROJECT_FAILURE:
		case Types.COPY_PROJECT_FAILURE:
		case Types.UPDATE_PROJECT_FAILURE:
		case Types.UPDATE_PROJECT_STATUS_FAILURE:
		case Types.UPDATE_PROJECT_DWELLING_UNIT_FAILURE:
		case Types.UPDATE_PROJECT_CERTIFIER_FAILURE:
		case Types.UPDATE_PROJECT_CUSTOMER_FAILURE:
		case Types.CREATE_BUILDING_FAILURE:
		case Types.COPY_BUILDING_FAILURE:
		case Types.UPDATE_BUILDING_FAILURE:
		case Types.DELETE_BUILDING_FAILURE:
		case Types.CREATE_DWELLING_UNIT_FAILURE:
		case Types.UPDATE_DWELLING_UNIT_FAILURE:
		case Types.DELETE_DWELLING_UNIT_FAILURE:
		case Types.CREATE_PROJECT_PHOTO_FAILURE:
		case Types.UPDATE_PROJECT_PHOTO_FAILURE:
		case Types.UPDATE_PROJECT_PHOTO_CHANGE_FAILURE:
		case Types.DELETE_PROJECT_PHOTO_FAILURE:
		case Types.UPDATE_PROJECT_PDF_FAILURE:
		case Types.GENERATE_PROJECT_REPORT_FAILURE:
		case Types.DELETE_PROJECTS_FAILURE:
			return Object.assign({}, state, {
				inProgress: false,
				isLoading: false,
				didInvalidate: false,
				lastUpdated: action.receivedAt,
			});
		default:
			return state;
	}
}

export default projects