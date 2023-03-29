import axios from 'axios'
import moment from 'moment'
import qs from 'qs'

import { SERIALIZE_DATE_FORMAT } from 'constants'

const dateTimeMatch = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/

const encodeReplacer = (key, value) => {
    return (typeof value === 'string' && value.match(dateTimeMatch))
      ? moment(new Date(value)).format(SERIALIZE_DATE_FORMAT)
      : value
}
const decodeReplacer = (key, value) => {
    return (typeof value === 'string' && value.match(dateTimeMatch))
      ? moment(value, SERIALIZE_DATE_FORMAT).toDate()
      : value
}

const CancelToken = axios.CancelToken
const axiosRequests = {}

const instance = axios.create({
	headers: {
		'Content-Type': 'application/json'
	},
	paramsSerializer: params => {
        return qs.stringify(params, { 
            serializeDate: value => moment(new Date(value)).format(SERIALIZE_DATE_FORMAT),
            arrayFormat: 'brackets' 
        })
    },
    transformRequest: [(data, headers) => {
		return (headers['Content-Type'] === 'multipart/form-data') ? data : JSON.stringify(data, encodeReplacer)
	}],
    transformResponse: [data => {
        return JSON.parse(data, decodeReplacer)
    }]
})

instance.interceptors.response.use(response => response, error => {
	if (error.response) {
		if (parseInt(error.response.status) === 401) {
			window.location.assign('/logout')
		}
		return Promise.reject(error.response.data.errors ? { message: error.response.data.errors[0].msg } :
			(typeof error.response.data === 'string') ? { message: error.response.data } : error.response.data)
	}
	else if (error.request) {
		return Promise.reject(error.request ? { message: error.request.responseText } : { message: 'Request error' })
	}
	else {
		return Promise.reject(error)
	}
})

export const request = (config = {}) => {
	config.baseURL = `${window.location.origin}/api`
	config.headers = Object.assign(config.headers || {}, {
		'Xsrf-Token': document.querySelector('meta[name="xsrf-token"]').getAttribute('content')
	})
	return instance.request(config)
}

export const cancelableRequest = ({ id, ...config }) => {
	if (axiosRequests[id]) {
		axiosRequests[id].cancel()
	}

	const axiosRequest = CancelToken.source()
	axiosRequests[id] = axiosRequest

	const requestPromise = request(Object.assign(config, {
		cancelToken: axiosRequest.token
	}))
		.then(response => {
			const { data: dataResponse } = response

			axiosRequests[id] = null
			delete axiosRequests[id]

			return dataResponse.error ? Promise.reject(dataResponse.error) : Promise.resolve(dataResponse.result)
		}, (error) => {
			if (!axios.isCancel(error)) {
				return Promise.reject(error)
			}
		})

	requestPromise.cancel = axiosRequest.cancel

	return requestPromise
}