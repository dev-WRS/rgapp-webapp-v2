import { Navigate } from 'react-router-dom'

const SecureRoute = ({ isAllowed, redirectPath = '/login', children }) => {
	return isAllowed ? (
		<>{children}</>
	) : (
		<Navigate to={redirectPath} replace />
	)
}

export default SecureRoute

