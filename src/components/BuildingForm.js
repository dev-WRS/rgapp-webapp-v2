
import { useState, useMemo, useEffect, useRef } from 'react'
import { useTheme } from '@emotion/react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Stack from '@mui/material/Stack'
import Grid from '@mui/material/Grid'
import InputAdornment from '@mui/material/InputAdornment'
import Skeleton from '@mui/material/Skeleton'

import useForm from 'hooks/useForm'
import TextField from 'components/core/TextField'
import SelectField from 'components/core/SelectField'
import MultipleSelectField from 'components/core/MultipleSelectField'
import NumberField from 'components/core/NumberField'
import CurrencyField from 'components/core/CurrencyField'
import AreaField from 'components/core/AreaField'
import Button from 'components/core/Button'
import LoadingButton from 'components/core/LoadingButton'

import { useSelector } from 'react-redux'

let validations = {
	name: ['required'],
	address: ['required'],
	type: ['required'],
	qualifyingCategories: ['required'],
	area: ['required'],
	rate: ['required'],
	method: ['required'],
}

let fields = ['name', 'type', 'address', 'qualifyingCategories', 'area', 'rate', 'method', 'totalWatts', 'percentReduction', 'savingsRequirement']

const BuildingForm = ({
	open,
	record,
	context,
	isLoading,
	inProgress,
	onSubmit,
	onCancel
}) => {
	const theme = useTheme()
	const ref = useRef()
	const deductions = useSelector(state => state.deductions && state.deductions.data)
	const lpds = useSelector(state => state.lpds && state.lpds.data)
	const mode = useMemo(() => (record && record.id ? 'edit' : 'add'), [record])
	const taxYear = parseInt(context.taxYear)

	if (parseInt(context.taxYear) >= 2023) {
		fields = ['name', 'type', 'address', 'qualifyingCategories', 'area', 'rate', 'pwRate', 'percentSaving', 'savingsRequirement']
		validations = {
			name: ['required'], address: ['required'], type: ['required'], qualifyingCategories: ['required'], area: ['required'],
			rate: ['required'],
			pwRate: ['required'],
			percentSaving: ['required', { type: 'rangeNumber', minValue: 25, maxValue: 100 }]
		}
	} else {
		validations = { name: ['required'], address: ['required'], type: ['required'], qualifyingCategories: ['required'], area: ['required'], rate: ['required'], method: ['required'] }
		fields = ['name', 'type', 'address', 'qualifyingCategories', 'area', 'rate', 'method', 'totalWatts', 'percentReduction', 'savingsRequirement']
	}

	const calculateRateByYear = (percentSaving) => {
		let multiplier1 = 0;
		let multiplier2 = 0;
		let multiplier3 = 0;
		switch (parseInt(context.taxYear)) {
			case 2023: {
				multiplier1 = 0.0212;
				multiplier2 = 0.54;
				multiplier3 = 1.07;
				break;
			}
			case 2024: {
				multiplier1 = 0.0224;
				multiplier2 = 0.57;
				multiplier3 = 1.13;
				break;
			}
			case 2025: {
				multiplier1 = 0.0232;
				multiplier2 = 0.58;
				multiplier3 = 1.16;
				break;
			}
		}

		const result = Math.min((((Math.ceil(percentSaving)) / 100 - 0.25) * 100) * multiplier1 + multiplier2, multiplier3)
		return result.toFixed(2)
	}

	const calculatePwRateByYear = (percentSaving) => {
		let multiplier1 = 0;
		let multiplier2 = 0;
		let multiplier3 = 0;
		switch (parseInt(context.taxYear)) {
			case 2023: {
				multiplier1 = 0.11;
				multiplier2 = 2.68;
				multiplier3 = 5.36;
				break;
			}
			case 2024: {
				multiplier1 = 0.1128;
				multiplier2 = 2.83;
				multiplier3 = 5.65;
				break;
			}
			case 2025: {
				multiplier1 = 0.1164;
				multiplier2 = 2.90;
				multiplier3 = 5.81;
				break;
			}
		}

		const result = Math.min((((Math.ceil(percentSaving)) / 100 - 0.25) * 100) * multiplier1 + multiplier2, multiplier3)
		return result.toFixed(2)
	}

	const calculateDefaults = (buildingDefaults, qualifyingCategories) => {
		let calculatedDefaults = {}
		let newRate = null
		let pwNewRate = null
		if (parseInt(context.taxYear) >= 2023) {
			newRate = buildingDefaults.percentSaving && buildingDefaults.percentSaving > 0
				? calculateRateByYear(buildingDefaults.percentSaving)
				: 0;
			pwNewRate = buildingDefaults.percentSaving && buildingDefaults.percentSaving > 0
				? calculatePwRateByYear(buildingDefaults.percentSaving)
				: 0;

			calculatedDefaults = {
				method: '',
				savingsRequirement: '',
				rate: newRate,
				pwRate: pwNewRate,
				percentSaving: buildingDefaults.percentSaving,
				qualifyingCategories: ['Whole Building']
			}

		} else {
			const method = buildingDefaults ? buildingDefaults.method : state.method

			if (qualifyingCategories) {
				const isNotJustLighting = !(qualifyingCategories.length === 1 && cat === 'Lighting')
	
				const newMethod = isNotJustLighting ? 'Permanent' : method
				let newQualifyingCategory = qualifyingCategories;

				if (qualifyingCategories.length === 3) {
					newQualifyingCategory = ['Whole Building'];
				} else if (qualifyingCategories.length === 1 && cat === 'HVAC+L') {
					newQualifyingCategory = ['HVAC', 'Lighting'];
				} else if (qualifyingCategories.length === 1 && cat === 'HVAC+ENV') {
					newQualifyingCategory = ['HVAC', 'Envelope'];
				} else if (qualifyingCategories.length === 1 && cat === 'L+ENV') {
					newQualifyingCategory = ['Lighting', 'Envelope'];
				}

				let newSavingsRequirement = null;
				let qualifiedDeduction = null;

				newSavingsRequirement = newQualifyingCategory.reduce((acc, curr) => {
					qualifiedDeduction = deductions.find(item => item.taxYear <= parseInt(context.taxYear)
						&& item.method === newMethod && item.qualifyingCategory === curr) || deductions.slice(-1);
					newRate = qualifiedDeduction.taxDeduction;

					return (acc[curr] = qualifiedDeduction.savingsRequirement, acc);
				}, {});

				if (newQualifyingCategory.length === 2) {
					newRate *= 2
				}

				calculatedDefaults = {
					method: newMethod,
					savingsRequirement: newSavingsRequirement,
					rate: newRate,
					qualifyingCategories: newQualifyingCategory
				}
			}
		}
		return Object.assign(buildingDefaults, calculatedDefaults)
	}

	const buildingDefaults = context.buildingDefaults ? calculateDefaults(context.buildingDefaults, context.buildingDefaults.qualifyingCategories) : null

	const fieldsInitial = useMemo(() => {
		return fields.reduce((result, name) => {
			if (parseInt(context.taxYear) < 2023) {
				result[name] = (mode === 'edit' && record[name]) ? record[name] : (buildingDefaults ? buildingDefaults[name] : '');
			} else {
				if ((name === 'pwRate' || name === 'percentSaving') && (!record || !record['percentSaving'])) {
					result['pwRate'] = 0;
					result['rate'] = 0;
					result['percentSaving'] = 0;
				} else {
					result[name] = (mode === 'edit' && record[name]) ? record[name] : (buildingDefaults ? buildingDefaults[name] : '');
				}

				if (name === 'qualifyingCategories' && (!record || record['qualifyingCategories'] !== undefined)) {
					let qualifyingCategories;
					if (mode === 'edit') {
						qualifyingCategories = record['qualifyingCategories'] ? record['qualifyingCategories'] : buildingDefaults['qualifyingCategories'];
					} else {
						qualifyingCategories = buildingDefaults ? buildingDefaults['qualifyingCategories'] : ['Whole Building'];
					}

					result['qualifyingCategories'] = qualifyingCategories;
				}
			}

			return result
		}, {})
	}, [mode, record, buildingDefaults, context])
	const fieldsValidator = useMemo(() => {
		return fields.reduce((result, name) => {
			if (validations[name]) result[name] = validations[name]
			return result
		}, {})
	}, [])

	const [validationsState, setValidationsState] = useState(fieldsValidator)

	const { state, formValidate, getError, getErrors, onValueChange, onBlur } = useForm({
		initialState: fieldsInitial,
		validations: validationsState
	})

	const qualifyLightingCategory = state.qualifyingCategories && state.qualifyingCategories.length === 1 && state.qualifyingCategories[0] === 'Lighting'

	const firstCat = state.qualifyingCategories?.[0] || '';
	const cat = normalizePlus(firstCat);

	useEffect(() => {
		if (taxYear < 2023) {
			setValidationsState(prevState => {
				const newState = { ...prevState }


				state.method && state.method !== 'Permanent' ? newState['totalWatts'] = ['required'] : delete newState['totalWatts']
				state.method && state.method !== 'Permanent' ? newState['percentReduction'] = ['required', { type: 'rangeNumber', minValue: 25, maxValue: 100 }] : delete newState['percentReduction']

				formValidate(newState)
				return newState
			})
		}
	}, [state.method])

	const handleSubmit = async (event) => {
		event.preventDefault()
		const isValid = formValidate()

		if (isValid) {
			onSubmit && onSubmit(state)
		}
	}

	const handleQualifyingCategoriesChange = (event) => {
		const value = event.target.value
		const isNotJustLighting = !(value.length === 1 && state.qualifyingCategories && state.qualifyingCategories[0] === 'Lighting')

		const newTotalWatts = isNotJustLighting ? '' : state.totalWatts
		const newPercentReduction = isNotJustLighting ? '' : state.percentReduction

		const calculatedDefaults = calculateDefaults(state, value)

		onValueChange({ target: { id: 'rate', value: calculatedDefaults.rate } })
		onValueChange({ target: { id: 'method', value: calculatedDefaults.method } })
		onValueChange({ target: { id: 'totalWatts', value: newTotalWatts } })
		onValueChange({ target: { id: 'percentReduction', value: newPercentReduction } })
		onValueChange({ target: { id: 'savingsRequirement', value: calculatedDefaults.savingsRequirement } })
		onValueChange({ target: { id: 'qualifyingCategories', value: calculatedDefaults.qualifyingCategories } })
	}

	const handleMethodChange = (event) => {
		const value = event.target.value

		const newTotalWatts = value === 'Permanent' ? '' : state.totalWatts
		const newPercentReduction = value === 'Permanent' ? '' : state.percentReduction

		// setValidationsState(prevState => {
		// 	const newState = { ...prevState }

		// 	value !== 'Permanent' ? newState['totalWatts'] = ['required'] : delete newState['totalWatts']
		// 	value !== 'Permanent' ? newState['percentReduction'] = ['required', { type: 'rangeNumber', minValue: 25, maxValue: 100 }] : delete newState['percentReduction']

		// 	console.log('validate: ', newState)
		// 	return newState
		// })

		let newSavingsRequirement = null
		let qualifiedDeduction = null
		let newRate = null

		newSavingsRequirement = state.qualifyingCategories.reduce((acc, curr) => {
			qualifiedDeduction = deductions.find(item => item.taxYear <= parseInt(context.taxYear) && item.method === value && item.qualifyingCategory === curr) || deductions.slice(-1)
			newRate = qualifiedDeduction.taxDeduction

			return (acc[curr] = qualifiedDeduction.savingsRequirement, acc)
		}, {})

		newSavingsRequirement = value === 'Permanent' ? newSavingsRequirement : null

		onValueChange({ target: { id: 'rate', value: newRate } })
		onValueChange({ target: { id: 'totalWatts', value: newTotalWatts } })
		onValueChange({ target: { id: 'percentReduction', value: newPercentReduction } })
		onValueChange({ target: { id: 'savingsRequirement', value: newSavingsRequirement } })
		onValueChange({ target: { id: 'method', value } })
		if (value !== 'Permanent') {
			onValueChange({ target: { id: 'type', value: '' } })
		}
	}

	const handleTypeChange = (event) => {
		const value = event.target.value

		const { lpd } = lpds.find(item => item.taxYear <= parseInt(context.taxYear) && item.buildingType === value) || lpds.slice(-1)

		onValueChange({ target: { id: 'ashraeLpd', value: lpd } })
		onValueChange({ target: { id: 'ashraeRequiredLpd', value: value === 'Warehouse' ? (lpd * 0.5).toFixed(3) : (lpd * 0.6).toFixed(3) } })
		onValueChange({ target: { id: 'type', value } })
	}

	const handlePercentReductionChange = (event) => {
		const value = event.target.value

		let newRate = null

		const qualifiedDeduction = deductions.find(item => item.taxYear <= parseInt(context.taxYear) && item.method === state.method && item.qualifyingCategory === 'Lighting' && item.savingsRequirement === (parseInt(value) >= 40 ? 40 : 25)) || deductions.slice(-1)
		newRate = qualifiedDeduction.taxDeduction

		if (parseInt(value) >= 25) {
			const multiplier = 1 - ((10 / 3) * (0.4 - value / 100))
			newRate = multiplier >= 1 ? newRate : multiplier * 0.6
		}

		onValueChange({ target: { id: 'rate', value: newRate || state.rate } })
		onValueChange({ target: { id: 'percentReduction', value } })
	}

	const handlePercentSavingChange = (event) => {
		const value = event.target.value
		const newRate = value > 0 ? calculateRateByYear(value) : 0;
		const pwNewRate = value > 0 ? calculatePwRateByYear(value) : 0;

		onValueChange({ target: { id: 'percentSaving', value } })
		onValueChange({ target: { id: 'rate', value: newRate || state.rate } })
		onValueChange({ target: { id: 'pwRate', value: pwNewRate || state.pwRate } })
	}

	const normalizePlus = (str = '') => str.replace(/\s*\+\s*/g, '+');

	return (
		<>
			<Dialog
				open={open}
				disableEscapeKeyDown
				PaperProps={{
					sx: {
						maxWidth: '580px',
						minWidth: '580px',
						minHeight: '388px'
					}
				}}
			>
				<DialogTitle>{(isLoading) ? <Skeleton /> : `${mode === 'add' ? 'Add' : 'Edit'} Building`}</DialogTitle>
				{isLoading ?
					<>
						<Skeleton variant="rectangular" component="div" sx={{ flex: 1, m: theme.spacing(0, 3, .5) }} />
						<Skeleton sx={{ height: 64, m: theme.spacing(0, 3, 3) }} />
					</> :
					<form ref={ref} autoComplete="off" noValidate onSubmit={handleSubmit}>
						<DialogContent
							sx={{
								padding: theme.spacing(1, 3, 0)
							}}
						>
							<Stack direction="row" spacing={2}>
								<TextField id="name" label="Name" disabled={inProgress}
									fullWidth
									size={'medium'}
									value={state.name}
									onChange={onValueChange}
									onBlur={onBlur}
									{...getError('name')}
								/>
								{!state.method || state.method === 'Permanent' ? (
									<TextField id="type" label="Type" disabled={inProgress}
										fullWidth
										size={'medium'}
										value={state.type}
										onChange={onValueChange}
										onBlur={onBlur}
										{...getError('type')}
									/>
								) : (
									<SelectField id="type" label="Type" disabled={inProgress}
										fullWidth
										size={'medium'}
										valueProp="value"
										textProp="value"
										value={state.type}
										options={[
											{ 'value': 'Automotive Facility' },
											{ 'value': 'Convention Center' },
											{ 'value': 'Court House' },
											{ 'value': 'Dining: Bar Lounge/Leisure' },
											{ 'value': 'Dining: Cafeteria/Fast Food' },
											{ 'value': 'Dining: Family' },
											{ 'value': 'Dormitory' },
											{ 'value': 'Exercise Center' },
											{ 'value': 'Gymnasium' },
											{ 'value': 'Hospital/Healthcare' },
											{ 'value': 'Hotel' },
											{ 'value': 'Library' },
											{ 'value': 'Manufacturing Facility' },
											{ 'value': 'Motel' },
											{ 'value': 'Motion Picture Theatre' },
											{ 'value': 'Multi-Family' },
											{ 'value': 'Museum' },
											{ 'value': 'Office' },
											{ 'value': 'Parking Garage' },
											{ 'value': 'Penitentiary' },
											{ 'value': 'Performing Arts Theatre' },
											{ 'value': 'Police/Fire Station' },
											{ 'value': 'Post Office' },
											{ 'value': 'Religious Building' },
											{ 'value': 'Retail' },
											{ 'value': 'School/University' },
											{ 'value': 'Sports Arena' },
											{ 'value': 'Town Hall' },
											{ 'value': 'Transportation' },
											{ 'value': 'Warehouse' },
											{ 'value': 'Workshop' }
										]}
										onChange={handleTypeChange}
										onBlur={onBlur}
										{...getError('type')}
									/>
								)}
							</Stack>
							<TextField id="address" label="Address" disabled={inProgress}
								fullWidth
								size={'medium'}
								value={state.address}
								onChange={onValueChange}
								onBlur={onBlur}
								{...getError('address')}
							/>
							<Grid container spacing={2}>
								<Grid item xs={6}>
									<MultipleSelectField id="qualifyingCategories" label="Qualifying Categories" disabled={inProgress || parseInt(context.taxYear) >= 2023}
										fullWidth
										size={'medium'}
										valueProp="value"
										textProp="value"
										value={(firstCat === 'Whole Building') 
												? ['HVAC', 'Lighting', 'Envelope'] 
												: (cat === 'HVAC+L')
												? ['HVAC', 'Lighting'] 
												: (cat === 'HVAC+ENV') 
												? ['HVAC', 'Envelope']
												: (cat === 'L+ENV') 
												? ['Lighting', 'Envelope'] 
												: state.qualifyingCategories}
										options={[
											{ 'value': 'HVAC' },
											{ 'value': 'Lighting' },
											{ 'value': 'Envelope' }
										]}
										onChange={handleQualifyingCategoriesChange}
										onBlur={onBlur}
										{...getError('qualifyingCategories')}
									/>
								</Grid>
								<Grid item xs={3.5}>
									<AreaField id="area" label="Area" disabled={inProgress}
										fullWidth
										size={'medium'}
										value={state.area}
										onChange={onValueChange}
										onBlur={onBlur}
										{...getError('area')}
									/>
								</Grid>
								{parseInt(context.taxYear) < 2023 && (
									<Grid item xs={2.5}>
										<CurrencyField id="rate" label="Rate" disabled={inProgress}
											fullWidth
											size={'medium'}
											value={state.rate}
											onChange={onValueChange}
											onBlur={onBlur}
											{...getError('rate')}
										/>
									</Grid>
								)}
							</Grid>
							{parseInt(context.taxYear) >= 2023 && (
								<Grid container spacing={2}>
									<Grid item xs={6}>
										<NumberField id="percentSaving" label="Percent Saving"
											fullWidth
											size={'medium'}
											value={state.percentSaving}
											onChange={handlePercentSavingChange}
											onBlur={onBlur}
											{...getError('percentSaving')}
											InputProps={{
												endAdornment: <InputAdornment position="start">%</InputAdornment>
											}}
										//sx={{ display: state.method && state.method !== 'Permanent' ? 'block' : 'none' }}
										/>
									</Grid>
									<Grid item xs={3}>
										<CurrencyField id="rate" label="Rate" disabled={inProgress || parseInt(context.taxYear) >= 2023}
											fullWidth
											size={'medium'}
											value={state.rate}
											onChange={onValueChange}
											onBlur={onBlur}
											{...getError('rate')}
										/>
									</Grid>
									<Grid item xs={3}>
										<CurrencyField id="pwRate" label="PW Rate" disabled={inProgress || parseInt(context.taxYear) >= 2023}
											fullWidth
											size={'medium'}
											value={state.pwRate}
											onChange={onValueChange}
											onBlur={onBlur}
											{...getError('pwRate')}
										/>
									</Grid>
								</Grid>
							)}
							{parseInt(context.taxYear) < 2023 && (
								<>
									<SelectField id="method" label="Method" disabled={!(qualifyLightingCategory) || inProgress}
										fullWidth
										size={'medium'}
										valueProp="value"
										textProp="value"
										value={state.method}
										options={[
											{ 'value': 'Permanent' },
											{ 'value': 'Interim Whole Building' },
											{ 'value': 'Interim Space-by-Space' }
										]}
										onChange={handleMethodChange}
										onBlur={onBlur}
										{...getError('method')}
									/>
									<Stack direction="row" spacing={2}>
										<NumberField id="totalWatts" label="Total Watts" disabled={(!(qualifyLightingCategory && state.method && state.method !== 'Permanent')) || inProgress}
											fullWidth
											size={'medium'}
											value={state.totalWatts}
											onChange={onValueChange}
											onBlur={onBlur}
											{...getError('totalWatts')}
										//sx={{ display: state.method && state.method !== 'Permanent' ? 'block' : 'none' }}
										/>
										<NumberField id="percentReduction" label="Reduction" disabled={(!(qualifyLightingCategory && state.method && state.method !== 'Permanent')) || inProgress}
											fullWidth
											size={'medium'}
											value={state.percentReduction}
											onChange={handlePercentReductionChange}
											onBlur={onBlur}
											{...getError('percentReduction')}
											InputProps={{
												endAdornment: <InputAdornment position="start">%</InputAdornment>
											}}
										//sx={{ display: state.method && state.method !== 'Permanent' ? 'block' : 'none' }}
										/>
									</Stack>
								</>

							)}
						</DialogContent>
						<DialogActions
							sx={{
								padding: theme.spacing(1, 3, 4)
							}}
						>
							<div style={{ flex: '1 0 0' }} />
							<Button variant="outlined"
								sx={{ width: '120px' }}
								color="cancel"
								fullWidth
								disabled={inProgress}
								onClick={onCancel}
							>Cancel</Button>
							<LoadingButton type="submit" variant="contained"
								sx={{ color: 'white', width: '120px' }}
								color="secondary"
								fullWidth
								disabled={inProgress}
								loading={inProgress}
							>Submit</LoadingButton>
						</DialogActions>
					</form>
				}
			</Dialog>
		</>
	)
}

export default BuildingForm