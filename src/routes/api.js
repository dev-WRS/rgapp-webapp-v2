const afterResponse = (req, res, data) => {
	const { result: user } = data
	const { id, token, email, name, phone, role } = user

	req.session.user =  { id, token, email, name, phone, role }
	req.session.save()	
}

const asResponse = (data) => {
	if (data.result) delete data.result.token
	return data
}

const prefix = '/api'
const authRoutes = [
	{ url: '/login', method: 'post', afterResponse, asResponse },
	{ url: '/email-verify', method: 'post', afterResponse, asResponse },

	{ url: '/send-code', method: 'post' },
	{ url: '/reset-password', method: 'post' },
	{ url: '/change-password', method: 'post' }
]

const apiRoutes = [
	{ url: '/actions', method: 'get' },
	
	{ url: '/deductions', method: 'get' },
	{ url: '/lpds', method: 'get' },

	{ url: '/assets', method: 'get' },
	{ url: '/assets', method: 'post' },
	{ url: '/assets', method: 'delete' },
	{ url: '/assets/:id', method: 'get' },

	{ url: '/users', method: 'get' },
	{ url: '/users', method: 'post' },
	{ url: '/users/:id', method: 'get' },
	{ url: '/users/:id', method: 'put' },
	{ url: '/users/:id/activate', method: 'put' },
	{ url: '/users/:id/deactivate', method: 'put' },
	{ url: '/users/:id', method: 'delete' },
	
	{ url: '/roles/:id', method: 'get' },
	{ url: '/roles/:id', method: 'put' },

	{ url: '/customers', method: 'get' },
	{ url: '/customers', method: 'post' },
	{ url: '/customers/:id', method: 'get' },
	{ url: '/customers/:id', method: 'put' },
	{ url: '/customers/:id', method: 'delete' },

	{ url: '/certifiers', method: 'get' },
	{ url: '/certifiers', method: 'post' },
	{ url: '/certifiers/:id', method: 'get' },
	{ url: '/certifiers/:id', method: 'put' },
	{ url: '/certifiers/:id', method: 'delete' },

	{ url: '/projects', method: 'get' },
	{ url: '/projects/:projectID/lookup', method: 'get' },
	{ url: '/projects', method: 'post' },
	{ url: '/projects/:id/copy', method: 'post' },
	{ url: '/projects/:id', method: 'get' },
	{ url: '/projects/:id', method: 'put' },
	{ url: '/projects/:id', method: 'delete' },
	{ url: '/projects/deleteProjects', method: 'post'},

	{ url: '/projects/:id/status', method: 'put' }, 
	{ url: '/projects/:id/report', method: 'put' }, 

	{ url: '/projects/:id/dwellingUnit', method: 'put' }, 
	{ url: '/projects/:id/certifier', method: 'put' }, 
	{ url: '/projects/:id/customer', method: 'put' }, 

	{ url: '/projects/:id/buildings', method: 'get' },
	{ url: '/projects/:id/buildings', method: 'post' },
	{ url: '/projects/:id/buildings/:buildingId/copy', method: 'post' },
	{ url: '/projects/:id/buildings/:buildingId', method: 'get' },
	{ url: '/projects/:id/buildings/:buildingId', method: 'put' },
	{ url: '/projects/:id/buildings', method: 'delete' },

	{ url: '/projects/:id/dwellingUnits', method: 'get' },
	{ url: '/projects/:id/dwellingUnits', method: 'post' },
	{ url: '/projects/:id/dwellingUnits/:unitId', method: 'get' },
	{ url: '/projects/:id/dwellingUnits/:unitId', method: 'put' },
	{ url: '/projects/:id/dwellingUnits', method: 'delete' },

	{ url: '/projects/:id/photos', method: 'post' },
	{ url: '/projects/:id/photosMultiple', method: 'post' },
	{ url: '/projects/:id/photos/:photoId', method: 'put' },
	{ url: '/projects/:id/photos/:photoId/change', method: 'put' },
	{ url: '/projects/:id/photos/:photoId', method: 'delete' },
	{ url: '/projects/:id/photos/deletePhotos', method: 'post' },

	{ url: '/projects/:id/certificate45L', method: 'put' },
	{ url: '/projects/:id/baselineDesign179D', method: 'put' },
	{ url: '/projects/:id/wholeBuildingDesign179D', method: 'put' },
	{ url: '/projects/:id/buildingSummary179D', method: 'put' },
	{ url: '/projects/:id/softwareCertificate179D', method: 'put' }
]

const init = ({ config, router, xsrfProtection, httpProxy }) => {
	const { dispatch, pipe } = httpProxy
	const pathname = value => value.substring(prefix.length)

	xsrfProtection && router.use(xsrfProtection)

	authRoutes.forEach(({ url, ...others }) => dispatch(router, { 
		fromUrl: `${prefix}${url}`,
		toUrl: url,
		...others 
	}))

	apiRoutes.forEach(({ url, method }) => router[method](`${prefix}${url}`,
		//TODO: middleware to check auth session
		pipe({ config,  pathname })	
	))

	return router
}

export default init