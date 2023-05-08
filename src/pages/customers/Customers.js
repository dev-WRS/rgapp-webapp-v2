import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import checkPermission from 'check-permission'

import CustomerList from 'components/CustomerList'

import AddCustomer from './AddCustomer'
import EditCustomer from './EditCustomer'
import DeleteCustomer from './DeleteCustomer'

import { fetchCustomers } from 'actions'
import { MSG_TYPE } from 'constants'

const Customers = () => {
	const dispatch = useDispatch()
	const permissions = useSelector(state => state.permissions && state.permissions.data)
	const customers = useSelector(state => state.customers && state.customers.data)
	const [isLoading, setLoading] = useState(false)
	const actions = useMemo(() => [
		{ key: 'add-customers', label: 'Add', icon: 'plus', element: AddCustomer },
		{ key: 'edit-customers', label: 'Edit', icon: 'pencil', element: EditCustomer, disabled: (selection) => (selection.length !== 1), default: true },
		{ key: 'delete-customers', label: 'Delete', icon: 'trash-can', element: DeleteCustomer, disabled: (selection) => (selection.length === 0) }
	], [])

	useEffect(() => {
		setLoading(true)
		dispatch(fetchCustomers()).then(() => {
			setTimeout(() => setLoading(false), 2000)
		}).catch(() => setLoading(false))
	}, [dispatch])

	const handleRefresh = () => {
		setLoading(true)
		dispatch(fetchCustomers()).then(() => {
			setTimeout(() => setLoading(false), 2000)
		}).catch(() => setLoading(false))
	}
	const handleActionClose = (action, result) => {
		if (result && result.type !== MSG_TYPE.error) {
			setLoading(true)
			dispatch(fetchCustomers()).then(() => {
				setTimeout(() => setLoading(false), 2000)
			}).catch(() => setLoading(false))
		}
	}

	return (
		<CustomerList
			actions={actions.filter(item => 
				checkPermission(item, permissions))}
			customers={customers}
			defaultAction={actions.find(item => item.default)}
			onRefresh={handleRefresh}
			onActionClose={handleActionClose}
			isLoading={isLoading}
		/>
	)
}

export default Customers