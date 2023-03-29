import csrf from 'csurf'
import HttpProxy from 'http/proxy'

const init = ({ config }) => {
	const httpProxy = HttpProxy({ config })
	const xsrfProtection = csrf({ cookie: {
		httpOnly: true,
		sameSite: true
	} })
	
	return { xsrfProtection, httpProxy }
}

export default init