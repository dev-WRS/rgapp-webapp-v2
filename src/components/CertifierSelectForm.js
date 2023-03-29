import { useState, useMemo, useEffect } from 'react'
import { useTheme } from '@emotion/react'
import { useDispatch, useSelector } from 'react-redux'
import Stack from '@mui/material/Stack'

import useForm from 'hooks/useForm'
import TextField from 'components/core/TextField'
import SelectStateField from 'components/core/SelectStateField'
import SelectField from 'components/core/SelectField'
import UploadImgField from 'components/core/UploadImgField'

import { fetchCertifiers, fetchCertifiersByState } from 'actions'
import _ from 'lodash'

const validations = {
	certifier: ['required']
}

const fields = ['certifier']

const CertifierSelectForm = ({
	open,
	record,
	context,
	submit,
	isLoading,
	onSubmit,
	onCancel
}) => {
	const dispatch = useDispatch()
	const certifiers = useSelector(state => state.certifiers && state.certifiers.data)
	const inProgress = useSelector(state => state.certifiers && state.certifiers.inProgress)
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

	const [signatureState, setSignatureState] = useState()
	const [licenseStState, setLicenseStState] = useState()
	const [licenseNoState, setLicenseNoState] = useState()

	useEffect(() => {
		if (context.reportType === '45L') {
			dispatch(fetchCertifiers())
		} else {
			dispatch(fetchCertifiersByState(context.state))
		}
	}, [dispatch, context.reportType, context.state])

	useEffect(() => {
		const certifier = certifiers.find(item => item.id === state.certifier)

		if (certifier) {
			setSignatureState(certifier.signature)
			setLicenseStState(certifier.licenses[0].state)
			setLicenseNoState(certifier.licenses[0].number)
		}
	}, [state.certifier, certifiers])

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
				<SelectField id="certifier" label="Certifier" disabled={inProgress}
					fullWidth
					valueProp="id"
					textProp="name"
					size={'medium'}
					value={state.certifier || ''}
					options={certifiers.length > 0 ? certifiers : [{ name: `No project state licensed certifier found` }]}
					onChange={onValueChange}
					onBlur={onBlur}
					{...getError('certifier')}
				/>
				<Stack direction="row" spacing={2} >
					<SelectStateField id="state" label="License State"
						fullWidth
						disabled
						size={'medium'}
						value={licenseStState || ''}
					/>
					<TextField id="number" label="License Number"
						fullWidth
						disabled
						size={'medium'}
						value={licenseNoState || ''}
					/>
				</Stack>
				<UploadImgField disabled
					fullWidth
					id="signature"
					label="Signature Preview"
					preview={true}
					width={340}
					height={135}
					value={(_.isString(signatureState) && !_.isEmpty(signatureState)) ? `/api/assets/${signatureState}` : signatureState}
				/>
			</form>
		</>
	)
}

export default CertifierSelectForm