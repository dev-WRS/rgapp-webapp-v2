import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import CustomerForm from 'components/CustomerForm'
import { fetchCustomer, updateCustomer } from 'actions'
import { MSG_TYPE } from 'constants'

const EditCustomer = ({
	selection, 
	onClose	
}) => {
	const dispatch = useDispatch()
	const customerId = (selection && selection[0]) ? selection[0].id : null
	const customer = useSelector(state => state.customers && state.customers.data && 
		customerId && state.customers.data.find(customer => customer.id === customerId))
	const isLoading = useSelector(state => state.customers && state.customers.isLoading)
	const inProgress = useSelector(state => state.customers && state.customers.inProgress)

	useEffect(() => {
		if (customerId) {
			dispatch(fetchCustomer(customerId))
		}
	}, [customerId, dispatch])

	const handleSubmit = async (state) => {
		const data = new FormData()
		
		Object.keys(state).forEach(name => data.append(name, state[name]))

		const { error } = await dispatch(updateCustomer(customerId, data))

		if (error) {
			onClose({
				type: MSG_TYPE.error,
				message: error.message
			})
		}
		else {
			onClose({
				type: MSG_TYPE.success,
				message: 'The customer has been successfully updated'
			})
		}
	}

	const handleCancel = () => {
		onClose && onClose()
	}

	return (
		<CustomerForm
			record={customer}
			open={true}
			isLoading={isLoading}
			inProgress={inProgress}
			onSubmit={handleSubmit}
			onCancel={handleCancel}
		/>
	)
}

export default EditCustomer