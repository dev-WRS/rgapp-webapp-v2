import { useEffect, useMemo } from 'react'

import useForm from 'hooks/useForm'
import TextField from 'components/core/TextField'

const validations = {
	dwellingUnitName: ['required'],
	totalDwellingUnits: ['required']
}

const fields = ['dwellingUnitName', 'dwellingUnitAddress', 'totalDwellingUnits']

const DwellingInfoForm = ({
	mode,
	record,
	submit,
	isLoading,
	inProgress,
	onSubmit,
	onCancel
}) => {
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
	const { state, formValidate, getError, getErrors, onValueChange, onBlur } = useForm({
		initialState: fieldsInitial,
		validations: fieldsValidator
	})

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
				<TextField id="dwellingUnitName" label="Dwelling Unit Name" disabled={inProgress}
					autoFocus
					fullWidth
					size={'medium'}
					value={state.dwellingUnitName}
					onChange={onValueChange}
					onBlur={onBlur}
					{...getError('dwellingUnitName')}
				/>
				<TextField id="dwellingUnitAddress" label="Dwelling Unit Address" disabled={inProgress}
					fullWidth
					size={'medium'}
					value={state.dwellingUnitAddress}
					onChange={onValueChange}
					onBlur={onBlur}
					{...getError('dwellingUnitAddress')}
				/>
				<TextField id="totalDwellingUnits" label="Total Dwelling Units" disabled={inProgress}
					fullWidth
					size={'medium'}
					value={state.totalDwellingUnits}
					onChange={onValueChange}
					onBlur={onBlur}
					{...getError('totalDwellingUnits')}
				/>
			</form>
		</>
	)
}

export default DwellingInfoForm