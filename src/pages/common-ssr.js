
const fetchRoles = async (req, { httpProxy }) => {
	let roles = []

	if (req.session.user) {
		const headers = { 'Authorization': `Bearer ${req.session.user.token}` }
		const { data } = await httpProxy.request({
			url: '/roles',
			method: 'get', headers
		})
		roles = data.result
	}

	return roles
}

export const getServerInitialState = async (req, options) => {
	const roles = await fetchRoles(req, options)
	
	return {
		roles: { data: roles }
	}
}