import { useSelector, useDispatch } from 'react-redux'

import UserForm from 'components/UserForm'
import { createUser } from 'actions'
import { MSG_TYPE } from 'constants'

const AddUser = ({ 
	onClose
}) => {
	const dispatch = useDispatch()
	const roles = useSelector(state => state.roles && state.roles.data)
	const inProgress = useSelector(state => state.users && state.users.inProgress)

	const handleSubmit = async ({ name, email, phone, role }) => {
		const { error, payload } = await dispatch(createUser({ name, email, phone, role }))

		if (error) {
			onClose({
				type: MSG_TYPE.error,
				message: error.message
			})
		}
		else if (payload) {
			onClose({
				type: MSG_TYPE.success,
				message: payload.message
			})
		}
		else {
			onClose()
		}
	}

	const handleCancel = () => {
		onClose && onClose()
	}
	
	return (
		<UserForm
			open={true}
			roles={roles}
			inProgress={inProgress}
			onSubmit={handleSubmit}
			onCancel={handleCancel}
		/>
	)
}

export default AddUser