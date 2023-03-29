import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import UserForm from 'components/UserForm'
import { fetchUser, updateUser } from 'actions'
import { MSG_TYPE } from 'constants'

const asUserRole = ({ role, ...user }) => ({
	role: role.id || role,
	...user
})

const EditUser = ({
	selection, 
	onClose
}) => {
	const dispatch = useDispatch()
	const userId = (selection && selection[0]) ? selection[0].id : null
	const roles = useSelector(state => state.roles && state.roles.data)
	const user = useSelector(state => state.users && state.users.data && 
		userId && state.users.data.find(user => user.id === userId))
	const isLoading = useSelector(state => state.users && state.users.isLoading)
	const inProgress = useSelector(state => state.users && state.users.inProgress)

	useEffect(() => {
		if (userId) {
			dispatch(fetchUser(userId))
		}
	}, [userId, dispatch])

	const handleSubmit = async ({ name, phone, role }) => {
		const { error } = await dispatch(updateUser({
			id: userId, 
			name, phone, role  
		}))

		if (error) {
			onClose({
				type: MSG_TYPE.error,
				message: error.message
			})
		}
		else {
			onClose({
				type: MSG_TYPE.success,
				message: 'The user has been successfully updated'
			})
		}
	}

	const handleCancel = () => {
		onClose && onClose()
	}

	return (
		<UserForm
			record={asUserRole(user)}
			open={true}
			roles={roles}
			isLoading={isLoading}
			inProgress={inProgress}
			onSubmit={handleSubmit}
			onCancel={handleCancel}
		/>
	)
}

export default EditUser