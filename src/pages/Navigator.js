import { Routes, Route } from 'react-router-dom'

import pages from 'pages'
import SecureRoute from 'components/core/SecureRoute'

const Navigator = ({ routes, isSecure = false }) => {
	return (
		<Routes>
			{ routes && routes
				.filter(({ page }) => (page && pages[page]))
				.map(({ path, page, secure }, index) => {
					const Page = pages[page]
					return (
						<Route key={index} path={path} element={
							(secure) ? 
								<SecureRoute isAllowed={isSecure}><Page/></SecureRoute> : 
								<Page/>
						}/>
					)
				}) 
			}
		</Routes>	
	)
}

export default Navigator