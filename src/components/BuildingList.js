import { useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'

import Paper from '@mui/material/Paper'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'

import DataBrowser from 'components/core/DataBrowser'
import EnterDataOptions from 'components/EnterDataOptions'
import BuildingForm from 'components/BuildingForm'

import { createBuilding } from 'actions'
import { MSG_TYPE } from 'constants'

import { useSelector } from 'react-redux'

const buildingValidateBefore2023 = (building) => {
	const { name, type, address, qualifyingcategories, area, rate, method } = building
	return !!name &&
		!!type &&
		!!address &&
		(qualifyingcategories && qualifyingcategories.length > 0) &&
		!!area &&
		!!rate &&
		!!method
}

const buildingValidate2023 = (building) => {
	const { name, type, address, area, categories, percentsaving } = building
	return !!name &&
		!!type &&
		!!address &&
		!!categories &&
		!!area &&
		!!percentsaving
}

const BuildingList = ({
	context,
	actions,
	buildings,
	defaultAction,
	onRefresh,
	onActionClose
}) => {
	const dispatch = useDispatch()
	const deductions = useSelector(state => state.deductions && state.deductions.data)
	const lpds = useSelector(state => state.lpds && state.lpds.data)
	const taxYear = parseInt(context.taxYear)
	const columns = useMemo(() => [
		{ label: 'Name', dataKey: 'name', dataType: 'string', disablePadding: false, render: undefined },
		{ label: 'Type', dataKey: 'type', dataType: 'string', disablePadding: false, render: undefined },
		{
			label: 'Area', dataKey: 'area', dataType: 'string', disablePadding: false,
			render: (row, column) => {
				return `${row[column.dataKey].toLocaleString('en-US', { maximumFractionDigits: 2 })} sqft`
			}
		},
		...(taxYear >= 2023 ?
			[
				{
					label: '% Saving', dataKey: 'percentSaving', dataType: 'string', disablePadding: false,
					render: (row, column) => {
						return row[column.dataKey] ? `${row[column.dataKey].toFixed(2)}%` : '0.00%'
					}
				}
			] : []
		),
		{
			label: 'Rate', dataKey: 'rate', dataType: 'string', disablePadding: false,
			render: (row, column) => {
				return row[column.dataKey] ? `$${row[column.dataKey].toFixed(2)}` : '$0.00'
			}
		},
		...(taxYear >= 2023 ?
			[
				{
					label: 'PW Rate', dataKey: 'pwRate', dataType: 'string', disablePadding: false,
					render: (row, column) => {
						return row['pwRate'] ? `$${row['pwRate'].toFixed(2)}` : '$0.00'
					}
				}
			] : []
		)
	])
	const [openState, setOpenState] = useState(false)
	const [openMsgState, setOpenMsgState] = useState(false)
	const [msgState, setMsgState] = useState()

	const handleEnterManually = () => {
		setOpenState(true)
	}

	const parseIntSafe = (value) => {
		if (!value) return 0;
		const parsed = parseFloat(value, 10);
		return isNaN(parsed) ? 0 : parsed;
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

	function calculateRate(taxYear, percentSavings) {
		if (percentSavings < 25) return { rate: 0, pwRate: 0 };

		const params = {
			2023: {
				baseStart: 0.54,
				baseMax: 1.07,
				baseStep: 0.02,
				bonusStart: 2.68,
				bonusMax: 5.36,
				bonusStep: 0.11,
			},
			2024: {
				baseStart: 0.57,
				baseMax: 1.13,
				baseStep: 0.02,
				bonusStart: 2.83,
				bonusMax: 5.65,
				bonusStep: 0.11,
			},
			2025: {
				baseStart: 0.58,
				baseMax: 1.16,
				baseStep: 0.02,
				bonusStart: 2.9,
				bonusMax: 5.81,
				bonusStep: 0.12,
			},
		};

		const p = params[taxYear];
		if (!p) throw new Error(`Unsupported tax year: ${taxYear}`);

		const extraPct = percentSavings - 25;

		const rawBase = p.baseStart + extraPct * p.baseStep;
		const rawBonus = p.bonusStart + extraPct * p.bonusStep;

		return {
			rate: Math.min(rawBase, p.baseMax).toFixed(2) * 1,
			pwRate: Math.min(rawBonus, p.bonusMax).toFixed(2) * 1,
		};
	}

	const handleValueChange = async (data) => {
		for (const item of data) {
			let newRate = 0
			if (taxYear >= 2023) {
				let pwNewRate = 0
				const percentSaving = parseIntSafe(item.percentsaving)

				newRate = calculateRate(taxYear, percentSaving).rate;
				pwNewRate = calculateRate(taxYear, percentSaving).pwRate;

				item.rate = newRate
				item.pwRate = pwNewRate
				item.percentSaving = percentSaving
			} else {
				let qualifiedDeduction = null;
				item.qualifyingCategories = item.qualifyingcategories

				const isNotJustLighting = !(item.qualifyingCategories.length === 1 && item.qualifyingCategories[0] === 'Lighting')
				const newMethod = isNotJustLighting ? 'Permanent' : item.method

				const newSavingsRequirement = item.qualifyingCategories.reduce((acc, curr) => {
					qualifiedDeduction = deductions.find(item => item.taxYear <= parseInt(taxYear)
						&& item.method === newMethod && item.qualifyingCategory === curr) || deductions.slice(-1);
					newRate = qualifiedDeduction.taxDeduction

					return (acc[curr] = qualifiedDeduction.savingsRequirement, acc);
				}, {});

				if (item.qualifyingCategories.length === 2) {
					newRate *= 2
				}

				item.rate = newRate
				item.method = newMethod
				item.savingsRequirement = newSavingsRequirement

				const isLightingWhole = item.qualifyingCategories && item.qualifyingCategories.length === 1
					&& item.qualifyingCategories[0] === 'Lighting' && item.method === 'Interim Whole Building'

				item.totalWatts = isLightingWhole ? parseIntSafe(item.totalwatts) : 0
				item.percentReduction = isLightingWhole ? parseIntSafe(item.percentreduction) : 0

				const { lpd } = lpds.find(item => item.taxYear <= parseInt(taxYear) && item.buildingType === item.type) || lpds.slice(-1)

				item.ashraeLpd = lpd ?? 0
				item.ashraeRequiredLpd = item.ashraeLpd === 0 ? 0 : item.type === 'Warehouse' ? (lpd * 0.5).toFixed(3) : (lpd * 0.6).toFixed(3)
			}
		}
		const { error } = await dispatch(createBuilding(context.id, data))

		if (error) {
			setMsgState({
				type: MSG_TYPE.error,
				message: error.message
			})
		}
		else {
			setMsgState({
				type: MSG_TYPE.success,
				message: 'The buildings has been successfully created'
			})
		}
		setOpenMsgState(true)
	}

	const handleSubmit = async (state) => {
		const { error } = await dispatch(createBuilding(context.id, [state]))

		if (error) {
			setMsgState({
				type: MSG_TYPE.error,
				message: error.message
			})
		}
		else {
			setMsgState({
				type: MSG_TYPE.success,
				message: 'The building has been successfully created'
			})
		}
		setOpenMsgState(true)
		setOpenState(false)
	}

	const handleCancel = () => {
		setOpenState(false)
	}

	const handleMsgClose = () => {
		setMsgState(null)
		setOpenMsgState(false)
	}

	return (
		<Paper sx={{
			marginBottom: '25px',
			boxShadow: 'none'
		}}>
			{buildings.length > 0 ? (
				<DataBrowser
					sx={{
						minHeight: '302px',
						maxHeight: '302px',
						overflow: 'scroll',
					}}
					actions={actions}
					columns={columns}
					rows={buildings}
					multiSelect={true}
					defaultAction={defaultAction}
					context={context}
					onRefresh={onRefresh}
					onActionClose={onActionClose}
					showTotalType={{ showTotal: true, type: 'Buildings' }}
				/>
			) : (
				<>
					<EnterDataOptions
						csvOptions={{ validate: parseInt(context.taxYear) >= 2023 ? buildingValidate2023 : buildingValidateBefore2023 }}
						onValueChange={handleValueChange}
						onEnterManually={handleEnterManually}
					/>
					<BuildingForm
						open={openState}
						context={context}
						onSubmit={handleSubmit}
						onCancel={handleCancel}
					/>
				</>
			)}

			{(openMsgState) && (
				<Snackbar open={openMsgState} autoHideDuration={6000} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} onClose={handleMsgClose}>
					<Alert onClose={handleMsgClose} severity={msgState.type} variant="filled">
						{msgState.message}
					</Alert>
				</Snackbar>
			)}
		</Paper>
	)
}

export default BuildingList