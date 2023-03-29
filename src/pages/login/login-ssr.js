export const handleBeforeState = (req, res, next) => {
	// if (req.session.user) {
	// 	res.redirect('/main')
	// }
	// else {
		next()
	// }
}

export const handleAfterState = (req, res, next) => {
	next()
}

export const getServerInitialState = async (req, { services, config }) => {
	return {}
}