import { useSelector, useDispatch } from 'react-redux'

import CustomerForm from 'components/CustomerForm'
import { createCustomer } from 'actions'
import { MSG_TYPE } from 'constants'

const AddCustomer = ({ 
	onClose
}) => {
	const dispatch = useDispatch()
	const inProgress = useSelector(state => state.customers && state.customers.inProgress)

	const handleSubmit = async (state) => {
		const data = new FormData()
		
		Object.keys(state).forEach(name => data.append(name, state[name]))
		
		const { error } = await dispatch(createCustomer(data))

		if (error) {
			onClose({
				type: MSG_TYPE.error,
				message: error.message
			})
		}
		else {
			onClose({
				type: MSG_TYPE.success,
				message: 'The customer has been successfully created'
			})
		}
	}

	const handleCancel = () => {
		onClose && onClose()
	}
	
	return (
		<CustomerForm
			open={true}
			inProgress={inProgress}
			onSubmit={handleSubmit}
			onCancel={handleCancel}
		/>
	)
}

export default AddCustomer