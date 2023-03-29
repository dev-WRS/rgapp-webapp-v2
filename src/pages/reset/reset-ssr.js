export const handleBeforeState = (req, res, next) => res.redirect('/')

export const handleAfterState = (req, res, next) => {
	next()
}

export const getServerInitialState = async (req, { services, config }) => {
	return {}
}