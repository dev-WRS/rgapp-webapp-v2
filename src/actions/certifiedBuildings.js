import { actionRequest } from 'actions/index';
import * as Types from 'constants/ActionTypes';

export const fetchCertifiedBuilding =
	(id) =>
	async (...args) => {
		const { payload, error, ...others } = await actionRequest(...args)({
			type: Types.FETCH_PROJECT_CERTIFIED_BUILDING,
			url: `/projects/certifiedBuildings/${id}`,
			method: 'post',
		});

		return { payload, error, ...others };
	};

export const fetchCertifiedBuildings =
	() =>
	async (...args) => {
		const { payload, error, ...others } = await actionRequest(...args)({
			type: Types.FETCH_PROJECT_CERTIFIED_BUILDINGS,
			url: '/projects/certifiedBuildings',
			method: 'post',
		});

		return { payload, error, ...others };
	};