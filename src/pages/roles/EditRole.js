import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import RoleForm from 'components/RoleForm'
import { fetchActions, fetchRole, updateRole } from 'actions'
import { ROLE_ADMIN_KEY, MSG_TYPE } from 'constants'

const groupsOrder = ['Projects', 'Reports', 'Assets', 'Customers', 'Certifiers', 'Users', 'Roles']
const namesOrder = ['List', 'Upload', 'Add', 'Edit', 'Generate', 'Open', 'Download', 'Print', 'Delete', 'Activate', 'Deactivate', 'Change Status']

const byGroupAndName = (a, b) => {
	const cmp1 = groupsOrder.indexOf(a.group) - groupsOrder.indexOf(b.group)
	const cmp2 = namesOrder.indexOf(a.name) - namesOrder.indexOf(b.name)
	return (cmp1 || cmp2)
}

const EditUser = ({ 
	selection, 
	onClose
}) => {
	const dispatch = useDispatch()
	const actions = useSelector(state => state.actions && state.actions.data)
	const role = useSelector(state => state.roles && state.roles.data && 
		selection && selection[0] && state.roles.data.find(role => role.id === selection[0].id))
	const isLoading = useSelector(state => state.actions && state.actions.inProgress)
	const inProgress = useSelector(state => state.roles && state.roles.inProgress)
	const sortedActions = useMemo(() => actions.sort(byGroupAndName), [actions])
	
	useEffect(() => {
		if (actions.length === 0) {
			dispatch(fetchActions())
		}
	}, [dispatch, actions])

	useEffect(() => {
		if (selection && selection[0]) {
			dispatch(fetchRole(selection[0].id))
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dispatch])

	const handleSubmit = async (state) => {
		const { error } = await dispatch(updateRole({
			id: selection[0].id,
			actions: state
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
				message: 'The role has been successfully updated'
			})
		}
	}

	return (
		<RoleForm
			open={true}
			role={role}
			actions={sortedActions}
			isReadOnly={role && role.key === ROLE_ADMIN_KEY}
			isLoading={isLoading || (role && role.actions.length === 0 && inProgress)}
			inProgress={inProgress}
			onSubmit={handleSubmit}
			onCancel={onClose}
		/>
	)
}

export default EditUser