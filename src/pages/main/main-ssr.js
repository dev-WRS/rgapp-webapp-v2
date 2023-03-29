import appSpec from 'app-spec.json'
import checkPermission from 'check-permission'

export const handleBeforeState = (req, res, next) => {
	next()
}

export const handleAfterState = (req, res, next) => {
	const { permissions } = req.initialState
	const route = appSpec.main.find(route => !!route.page && checkPermission(route, permissions.data))
	res.redirect(route? route.path : '/')
}

export const getServerInitialState = async (req, options) => {
	return {}
}