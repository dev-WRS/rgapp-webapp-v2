import { useState, useMemo, useEffect } from 'react'
import { useTheme } from '@emotion/react'
import { useDispatch, useSelector } from 'react-redux'

import useForm from 'hooks/useForm'
import ColorField from 'components/core/ColorField'
import SelectField from 'components/core/SelectField'
import UploadImgField from 'components/core/UploadImgField'

import { fetchCustomers } from 'actions'
import _ from 'lodash'

const validations = {
	customer: ['required']
}

const fields = ['customer']

const CustomerSelectForm = ({
	record,
	open,
	submit,
	isLoading,
	onSubmit,
	onCancel
}) => {
	const theme = useTheme()
	const dispatch = useDispatch()
	const customers = useSelector(state => state.customers && state.customers.data)
	const inProgress = useSelector(state => state.customers && state.customers.inProgress)
	const mode = useMemo(() => (record && record.id ? 'edit' : 'add'), [record])
	const fieldsInitial = useMemo(() => {
		return fields.reduce((result, name) => {
			result[name] = (mode === 'edit' && record[name]) ? record[name] : ''
			return result
		}, {})
	}, [mode, record])
	const fieldsValidator = useMemo(() => {
		return fields.reduce((result, name) => {
			if (validations[name]) result[name] = validations[name]
			return result
		}, {})
	}, [])
	const { state, formValidate, getError, onValueChange, onBlur } = useForm({
		initialState: fieldsInitial,
		validations: fieldsValidator
	})

	const [logoState, setLogoState] = useState()
	const [primaryColorState, setPrimaryColorState] = useState()

	useEffect(() => {
		dispatch(fetchCustomers())
	}, [dispatch])

	useEffect(() => {
		const customer = customers.find(item => item.id === state.customer)
		if (customer) {
			setLogoState(customer.logo)
			setPrimaryColorState(customer.primaryColor)
		}
	}, [state.customer, customers])

	const handleSubmit = async (event) => {
		const isValid = formValidate()

		if (isValid) {
			onSubmit && onSubmit(state)
		}
	}

	useEffect(() => {
		if (submit) handleSubmit()
	}, [submit])

	return (
		<>
			<form autoComplete="off" noValidate onSubmit={handleSubmit}>
				<SelectField id="customer" label="Customer" disabled={inProgress}
					fullWidth
					valueProp="id"
					textProp="name"
					size={'medium'}
					value={state.customer}
					options={customers}
					onChange={onValueChange}
					onBlur={onBlur}
					{...getError('customer')}
				/>
				<UploadImgField disabled
					fullWidth
					id="logo"
					label="Logo Preview"
					preview={true}
					width={340}
					height={135}
					value={(_.isString(logoState) && !_.isEmpty(logoState)) ? `/api/assets/${logoState}` : logoState}
				/>
				<ColorField id="color" label="Color" disabled
					fullWidth
					size={'medium'}
					value={primaryColorState}
				/>
			</form>
		</>
	)
}

export default CustomerSelectForm