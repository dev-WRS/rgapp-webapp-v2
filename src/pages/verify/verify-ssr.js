export const handleBeforeState = (req, res, next) => {
	const { email } = req.query
	console.log(email)
	return email ? next() : res.redirect('/')
}

export const handleAfterState = (req, res, next) => {
	next()
}

export const getServerInitialState = async (req, { services, config }) => {
	return {}
}