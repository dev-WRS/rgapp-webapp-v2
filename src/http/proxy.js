import axios from 'axios'
import https from 'https'
import http from 'http'
import _ from 'lodash'

const buildUrl = (path, params = {}) => {
    return Object.keys(params).reduce((url, name) => url.replace(new RegExp(`:${name}`, 'g'), params[name]), path)
}

const init = ({ config }) => {
	const { apiUrl, apiKey } = config || {}

	const instance = axios.create({
		baseURL: apiUrl,
		headers: {
			'Content-Type': 'application/json',
			'X-API-Key': `apikey ${apiKey}`
		}
	})

	instance.interceptors.response.use(response => response, error => {
		if (error.response) {
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

	const createHandler = ({ toUrl, method, afterResponse, asResponse }) => async (req, res, next) => {
		try {
			const headers = req.session.user ? { 'Authorization': `Bearer ${req.session.user.token}` } : {}
			const { query, params, body: data,  } = req
			const response = await request({
				url: buildUrl(toUrl, params),
				headers, method,
				params: query,
				data 
			})
			afterResponse && afterResponse(req, res, response.data)
			res.json(asResponse ? asResponse(response.data) : response.data)
		}
		catch (error) {
			next(error)
		}
	} 

	const request = (options = {}) => {
		return instance.request(options)
	}

	const dispatch = (router, { url, fromUrl, toUrl, method, ...options }) => {
		router[method](url || fromUrl,
			createHandler({
				toUrl: url || toUrl,
				method,
				...options
			})
		)
	}

	const pipe = ({ config, pathname }) => (req, res, next) => {
		const { host, ...headers } = req.headers
		// const readable = (req.readableLength > 0)
		const isMultipartFormdata = (headers['content-type'] && (headers['content-type'].indexOf('multipart/form-data;') === 0))
		const path = pathname ? _.isFunction(pathname) ? pathname(req.originalUrl) : pathname : req.originalUrl
		const url = new URL(apiUrl)

		headers['X-API-Key'] = `apikey ${apiKey}`
		if (req.session.user) {
			headers['Authorization'] = `Bearer ${req.session.user.token}`
		}
		
		const options = {
			host: url.hostname,
			port: url.port,
			method: req.method,
			headers, path	
		}

		const connector = (req.protocol === 'http' ? http : https).request(options, (response) => {
			res.writeHead(response.statusCode, response.headers)
			response.pipe(res, {
				end: true
			})
		})

		// if (readable) {
		if (isMultipartFormdata) {
			req.pipe(connector, {
				end:true
			})
		}
		else {
			if (!_.isEmpty(req.body)) {
				connector.write(JSON.stringify(req.body))
			}
			connector.end()
		}
	}

	return {
		request, dispatch, pipe
	}
}

export default init