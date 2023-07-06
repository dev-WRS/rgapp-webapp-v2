import { useEffect, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Alert from '@mui/material/Alert'
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'

import useForm from 'hooks/useForm'
import TextField from 'components/core/TextField'
import SelectStateField from 'components/core/SelectStateField'
import SelectField from 'components/core/SelectField'
import SearchFormField from 'components/core/SearchFormField'
import Snackbar from 'components/core/Snackbar'

import { fetchProjectInfo, createProject, updateProject } from 'actions'
import { MSG_TYPE } from 'constants'

const validations = {
	projectID: ['required'],
	name: ['required'],
	taxYear: ['required'],
	legalEntity: ['required'],
	state: ['required'],
	reportType: ['required'],
}

const fields = [
	'projectID', 
	'name', 
	'taxYear', 
	'legalEntity', 
	'state', 
	'inspectionDate', {
		name: 'software',
		defaultValue: null
	}, 
	'reportType',
	'draft'
]
const asField = (field) => (typeof field === 'object') ? field 
													   : (field === 'draft') 
													     ? { name: field, defaultValue: false } 
														 : { name: field, defaultValue: '' }

const ProjectInfoForm = ({
	mode,
	record,
	submit,
	isLoading,
	inProgress,
	onSubmit,
	onCancel
}) => {
	const dispatch = useDispatch()
	const fieldsInitial = useMemo(() => {
		return fields.reduce((result, field) => {
			field = asField(field)
			result[field.name] = (mode === 'edit' && record[field.name]) ? record[field.name] : field.defaultValue
			return result
		}, {})
	}, [mode, record])
	const fieldsValidator = useMemo(() => {
		return fields.reduce((result, field) => {
			field = asField(field)
			if (validations[field.name]) result[field.name] = validations[field.name]
			return result
		}, {})
	}, [])
	const [validationsState, setValidationsState] = useState(fieldsValidator)

	const { state, formValidate, getError, getErrors, onValueChange, onBlur } = useForm({
		initialState: fieldsInitial,
		validations: validationsState
	})
	const [searchInProgress, setSearchInProgress] = useState(false)
	const [disabledFields, setDisabledFields] = useState(record ? false : true)
	const [openMsgState, setOpenMsgState] = useState(false)
	const [msgState, setMsgState] = useState()

	useEffect(() => {
		if (submit) handleSubmit()	
	}, [submit])

	useEffect(() => {
		setValidationsState(prevState => {
			const newState = { ...prevState }			
			state.reportType === '179D' ? newState['software'] = ['required'] : delete newState['software']

			return newState
		})
	}, [state.reportType])

	const handleSubmit = async () => {
		if (formValidate()) {
			let action = null

			mode === 'add' ? action = createProject(state) : action = updateProject(record.id, state)

			const { payload, error } = await dispatch(action)
			
			if (error) {
				setMsgState({
					type: MSG_TYPE.error,
					message: error.message
				})
				setOpenMsgState(true)
			} 

			onSubmit && onSubmit(error ? false : true, payload)
		} else {
			onSubmit && onSubmit(false)
		}
	}

	const handleSearch = async (criteria) => {
		setSearchInProgress(true)
		const { error, payload } = await dispatch(fetchProjectInfo(criteria))

		if (error) {
			setMsgState({
				type: MSG_TYPE.error,
				message: error.message
			})
			setOpenMsgState(true)
		} else {
			Object.keys(payload).forEach(name => onValueChange({ target: { id: name, value: payload[name] } }))
			setDisabledFields(false)
		}

		setSearchInProgress(false)
	}

	const handleReportTypeChange = (event) => {
		const value = event.target.value
		const newSoftware = value === '45L' ? '' : state.software

		onValueChange({ target: { id: 'software', value: newSoftware } })
		onValueChange({ target: { id: 'reportType', value } })
	}

	const handleDraftChange = (event) => {
		const draft = event.target.checked
		onValueChange({ target: { id: 'draft', value: draft } })
	  };

	const handleMsgClose = () => {
		setMsgState(null)
		setOpenMsgState(false)
	}

	return (
		<>
			<form autoComplete="off" noValidate onSubmit={handleSubmit}>
				<SearchFormField id="projectID" label="Search by Project ID" disabled={mode === 'edit' || inProgress}
					fullWidth
					size={'medium'}
					value={state.projectID.trim()}
					autoFocus
					onSearch={handleSearch}
					onChange={onValueChange}
					onBlur={onBlur}
					{...getError('projectID')}
					inProgress={searchInProgress}
				/>
				<Grid container spacing={2}>
					<Grid item xs={8}>
						<TextField id="name" label="Project Name" disabled={disabledFields || searchInProgress || inProgress}
							fullWidth
							size={'medium'}
							value={state.name}
							onChange={onValueChange}
							onBlur={onBlur}
							{...getError('name')}
						/>
					</Grid>
					<Grid item xs={4}>
						<TextField id="taxYear" label="Tax Year" disabled={disabledFields || searchInProgress || inProgress}
							fullWidth
							size={'medium'}
							value={state.taxYear}
							onChange={onValueChange}
							onBlur={onBlur}
							{...getError('taxYear')}
						/>
					</Grid>
				</Grid>
				<Grid container spacing={2}>
					<Grid item xs={8}>
						<TextField id="legalEntity" label="Legal Entity" disabled={disabledFields || searchInProgress || inProgress}
							fullWidth
							size={'medium'}
							value={state.legalEntity}
							onChange={onValueChange}
							onBlur={onBlur}
							{...getError('legalEntity')}
						/>
					</Grid>
					<Grid item xs={4}>
						<SelectStateField id="state" label="State" disabled={disabledFields || searchInProgress || inProgress}
							fullWidth
							size={'medium'}
							value={state.state}
							onChange={onValueChange}
							onBlur={onBlur}
							{...getError('state')}
						/>
					</Grid>
				</Grid>
				<Stack direction="row" spacing={2}>
					<TextField id="inspectionDate" label="Inspection Date" disabled={disabledFields || searchInProgress || inProgress}
						fullWidth
						size={'medium'}
						value={state.inspectionDate}
						onChange={onValueChange}
						onBlur={onBlur}
						{...getError('inspectionDate')}
					/>
					<SelectField id="software" label="Software" disabled={state.reportType === '45L' || disabledFields || searchInProgress || inProgress}
						fullWidth
						valueProp="value"
						textProp="value"
						size={'medium'}
						value={state.software || ''}
						options={[
							{ 'value': 'eQuest 3.65' },
							{ 'value': 'Hourly Analysis Program (HAP) v5.10.' }
						]}
						onChange={onValueChange}
						onBlur={onBlur}
						{...getError('software')}
					/>
					<SelectField id="reportType" label="Report Type" disabled
						fullWidth
						valueProp="value"
						textProp="value"
						size={'medium'}
						value={state.reportType}
						options={[
							{ 'value': '45L' },
							{ 'value': '179D' }
						]}
						onChange={handleReportTypeChange}
						onBlur={onBlur}
						{...getError('reportType')}
					/>
				</Stack>
				<Stack direction="row" spacing={2}>
				<FormControlLabel
					control={
						<Switch checked={state.draft} onChange={handleDraftChange} name="draft" 
								color="secondary"
								disabled={disabledFields || searchInProgress || inProgress}/>
					}
					label="Draft Page"
					/>
				</Stack>
			</form>
			{(openMsgState) && (
				<Snackbar open={openMsgState} autoHideDuration={6000} onClose={handleMsgClose}>
					<Alert onClose={handleMsgClose} severity={msgState.type} variant="filled">
						{msgState.message}
					</Alert>
				</Snackbar>
			)}
		</>
	)
}

export default ProjectInfoForm