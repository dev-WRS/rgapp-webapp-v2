import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import checkPermission from 'check-permission'

import UserList from 'components/UserList'

import AddUser from './AddUser'
import EditUser from './EditUser'
import ActivateUser from './ActivateUser'
import DeactivateUser from './DeactivateUser'
import DeleteUser from './DeleteUser'

import { fetchUsers } from 'actions'
import { MSG_TYPE } from 'constants'

const Users = () => {
	const dispatch = useDispatch()
	const permissions = useSelector(state => state.permissions && state.permissions.data)
	const roles = useSelector(state => state.roles && state.roles.data)
	const users = useSelector(state => state.users && state.users.data)
	const [isLoading, setLoading] = useState(false)
	const actions = useMemo(() => [
		{ key: 'add-users', label: 'Add', icon: 'plus', element: AddUser },
		{ key: 'edit-users', label: 'Edit', icon: 'pencil', element: EditUser, disabled: (selection) => (selection.length !== 1), default: true },
		{ key: 'activate-users', label: 'Activate', icon: 'checkmark', element: ActivateUser, disabled: (selection) => 
			(selection.length !== 1 || (selection.length === 1 && (selection[0].emailVerified !== true || selection[0].active === true))) 
		},
		{ key: 'deactivate-users', label: 'Deactivate', icon: 'close', element: DeactivateUser, disabled: (selection) =>
			(selection.length !== 1 || (selection.length === 1 && (selection[0].emailVerified !== true || selection[0].active !== true)))
	 	},
		{ key: 'delete-users', label: 'Delete', icon: 'trash-can', element: DeleteUser, disabled: (selection) => (selection.length !== 1) }
	], [])

	useEffect(() => {
		setLoading(true) 
		dispatch(fetchUsers()).then(() => {
			setTimeout(() => setLoading(false), 2000)
		}).catch(() => setLoading(false))
	}, [dispatch])

	const handleRefresh = () => {
		setLoading(true) 
		dispatch(fetchUsers()).then(() => {
			setTimeout(() => setLoading(false), 2000)
		}).catch(() => setLoading(false))
	}

	const handleActionClose = (action, result) => {
		setLoading(true) 
		if (result && result.type !== MSG_TYPE.error) {
			dispatch(fetchUsers()).then(() => {
				setTimeout(() => setLoading(false), 2000)
			}).catch(() => setLoading(false))
		}
	}

		return (
			<UserList
				actions={actions.filter(item => 
					checkPermission(item, permissions))}
				roles={roles}
				users={users}
				defaultAction={actions.find(item => item.default)}
				onRefresh={handleRefresh}
				onActionClose={handleActionClose}
				isLoading={isLoading}
			/>
		)

}

export default Users