import { useSelector } from 'react-redux'
import checkPermission from 'check-permission'

import Auth from 'pages/auth/Auth'
import Main from 'pages/main/Main'
import { useMemo } from 'react'

const App = ({ appSpec }) => {
	const auth = useSelector(state => state.auth && state.auth.data)
	const permissions = useSelector(state => state.permissions && state.permissions.data)
	const mainRoutes = useMemo(() => appSpec.main.filter(route => 
		checkPermission(route, permissions)), [appSpec, permissions])
	const isValidUser = (auth && !!auth.id)
	const resetPwdRequired = (auth && !!auth.resetPwdRequired)

	return (!isValidUser || (isValidUser && resetPwdRequired)) ? 
		<Auth routes={appSpec.auth}/> : 
		<Main routes={mainRoutes}/>
}

export default App