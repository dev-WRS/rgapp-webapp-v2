export const handleBeforeState = (req, res, next) => {
	if (req.session.user) {
		next()		
	}
	else {
		res.redirect('/login')
	}
}

export const handleAfterState = (req, res, next) => {
	next()
}

export const getServerInitialState = async (req, options) => {
	return {}
}