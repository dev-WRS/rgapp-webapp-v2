import { combineReducers } from 'redux'

import auth from './auth'
import assets from './assets'
import users from './users'
import actions from './actions'
import permissions from './permissions'
import roles from './roles'
import customers from './customers'
import certifiers from './certifiers'
import projects from './projects'
import deductions from './deductions'
import lpds from './lpds'

export default combineReducers({
	auth,
	assets,
	users,
	actions,
	permissions,
	roles,
	customers,
	certifiers,
	projects, 
	deductions,
	lpds
})