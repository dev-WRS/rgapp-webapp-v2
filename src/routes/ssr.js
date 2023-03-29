
import * as React from 'react'
import { renderToString } from 'react-dom/server'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import { CacheProvider } from '@emotion/react'
import { Provider as StateProvider } from 'react-redux'
import createEmotionServer from '@emotion/server/create-instance'
import { StaticRouter } from 'react-router-dom/server'
import path from 'path'
import fs from 'fs'
import _ from 'lodash'
import { errors } from 'lts-server'

import App from 'App'
import createTheme from 'theme'
import createEmotionCache from 'emotion-cache'

import appSpec from 'app-spec.json'
import checkPermission from 'check-permission'
import { createStoreInitialState } from 'store'
import initialState from 'store/initialState'

import { getServerInitialState as preloadCommonState } from 'pages/common-ssr'

const { HttpUnauthorizedError } = errors

const routes = Object.keys(appSpec).reduce((result, key) => {
	const route = appSpec[key]
	if (_.isArray(route)) {
		result = result.concat(route)
	}
	else if (_.isObject(route)) {
		result.push(route)	
	}
	else {
		result.push({
			path: String(route),
			ssr: `${key}-ssr`
		})
	}
	return result
}, [])

const fetchPermissions = async (req, { httpProxy }) => {
	let permissions = []

	if (req.session.user) {
		const headers = { 'Authorization': `Bearer ${req.session.user.token}` }
		const { data } = await httpProxy.request({
			url: '/users/actions',
			method: 'get', headers
		})
		permissions = data.result
	}

	return permissions
}

const renderFullPage = (html, css, preloadedState, xsrfToken = '', title) => (`
	<!DOCTYPE html>
	<html lang="en">
		<head>
			<title>${title || ''}</title>
			${css}
			<meta name="viewport" content="initial-scale=1, width=device-width" />
			<meta name="xsrf-token" content="${xsrfToken}">
			<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
			<link rel="shortcut icon" href="/build/favicon.ico" type="image/x-icon">
		</head>
		<body style="position: fixed; width: 100%; height: 100%; overflow: hidden; margin: 0px; background: #F0EEE4;">
			<div id="root" style="height: 100%">${html}</div>
			<script id="js-initials">
				window.__PRELOADED_STATE__ = ${preloadedState}
			</script>
			<script async src="/build/bundle.js"></script>
		</body>
	</html>
`)

const handleRender = (config) => (req, res, next) => {
	try {
		const cache = createEmotionCache()
		const { extractCriticalToChunks, constructStyleTagsFromChunks } = createEmotionServer(cache)
		const store = createStoreInitialState(req.initialState)
		const theme = createTheme()
		
		const html = renderToString(
			<CacheProvider value={cache}>
				<ThemeProvider theme={theme}>
					<CssBaseline />
					<StateProvider store={store}>
						<StaticRouter location={req.url}>
							<App appSpec={appSpec} />
						</StaticRouter>
					</StateProvider>
				</ThemeProvider>
			</CacheProvider>
		)
		const emotionChunks = extractCriticalToChunks(html)
		const emotionCss = constructStyleTagsFromChunks(emotionChunks)
		const preloadedState = JSON.stringify(store.getState()).replace(
			/</g,
			'\\u003c'
		)
		const xsrfToken = (req.csrfToken) ? req.csrfToken() : ''

		res.send(renderFullPage(html, emotionCss, preloadedState, xsrfToken))
	}
	catch (error) {
		next(error)
	}
}

const handlePreloadState = (preloadState, options) => async (req, res, next) => {
	try {
		const prevState = Object.assign({...initialState} || {}, req.initialState)
		let state

		if (req.session.user) {
			const { token, ...sessionUser } = req.session.user
			const permissions = await fetchPermissions(req, options)
			Object.assign(prevState, { 
				auth: { data: { ...sessionUser } },
				permissions: { data: permissions.map(({ id, ...permission }) => permission) }
			})
		}

		//Common server initial state
		if (preloadCommonState && (typeof preloadCommonState === 'function')) {
			const commonState = await preloadCommonState(req, options)
			Object.assign(prevState, commonState || {})
		}
		
		if (preloadState && (typeof preloadState === 'function')) {
			state = await preloadState(req, options)
		}

		req.initialState = Object.assign(prevState, state || {})
		next()
	}
	catch (error) {
		next(error)
	}
}

const handleSecure = (req, res, next) => {
	if (!req.session.user) {
		res.redirect('/') 
	}
	else next()
}

const handleCheckPermission = (req, res, next) => {
	const initialState = req.initialState
	const route = routes.find(route => route.path === req.path)
	const permissions = initialState.permissions && initialState.permissions.data

	if (permissions && checkPermission(route, permissions)) {
		next()
	}
	else {
		next(new HttpUnauthorizedError('Unauthorized'))
	}
}

const importSSRPages = async (routes) => {
	const cwd = process.cwd()
	
	return await Promise.all(routes.map(async ({ page, ssr, ...route }) => {
		const ns = ssr.split('-')[0]
		const dirname = path.join(cwd, 'src', 'pages', ns)
		const name = `${ssr}.js`
		const fullPath = path.join(dirname, name)

		if (fs.existsSync(fullPath)) {
			const { handleBeforeState, handleAfterState, getServerInitialState: preloadInitState } = await import(fullPath)
			
			return { ...route, handleBeforeState, handleAfterState, preloadInitState }
		}
		return { ...route }
	}))
}

const init = async ({ passport, services, config, router, xsrfProtection, httpProxy }) => {
	const ssrPages = await importSSRPages(routes)

	xsrfProtection && router.use(xsrfProtection)
	ssrPages.forEach(({ path, method, secure, handleBeforeState, handleAfterState, preloadInitState }) => {
		const middlewares = []

		if (secure) middlewares.push(
			handleSecure
		)
		if (handleBeforeState) middlewares.push(
			handleBeforeState
		)
		if (preloadInitState) middlewares.push(
			handlePreloadState(preloadInitState, { services, httpProxy, config })
		)
		if (secure) middlewares.push(
			handleCheckPermission
		)
		if (handleAfterState) middlewares.push(
			handleAfterState
		)
		if (middlewares.length > 0) {
			method = method || 'get'
			router[method](path, middlewares)
		}
	})
	router.use(handleRender(config))

	return router
}

export default init