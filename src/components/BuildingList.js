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
	const taxYear = parseInt(context.taxYear)
	const columns = useMemo(() => [
		{ label: 'Name', dataKey: 'name', dataType: 'string', disablePadding: false, render: undefined },
		{ label: 'Type', dataKey: 'type', dataType: 'string', disablePadding: false, render: undefined },
		{ label: 'Area', dataKey: 'area', dataType: 'string', disablePadding: false, 
			render: (row, column) => {
				return `${row[column.dataKey].toLocaleString('en-US', {maximumFractionDigits:2})} sqft`
			}
		},
		...(taxYear >= 2023 ?
        [
            { label: '% Saving', dataKey: 'percentSaving', dataType: 'string', disablePadding: false,
                render: (row, column) => {
					return row[column.dataKey] ? `${row[column.dataKey].toFixed(2)}%`: '0.00%'
                }
            }
        ] : []
    	),
		{ label: 'Rate', dataKey: 'rate', dataType: 'string', disablePadding: false, 
			render: (row, column) => {
				return row[column.dataKey] ? `$${row[column.dataKey].toFixed(2)}` : '$0.00'
			}
		},
		...(taxYear >= 2023 ?
        [
            { label: 'PW Rate', dataKey: 'pwRate', dataType: 'string', disablePadding: false,
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
		const multiplier1 = parseInt(context.taxYear) === 2023 ? 0.0212 : 0.0224;
		const multiplier2 = parseInt(context.taxYear) === 2023 ? 0.54 : 0.57;
		const multiplier3 = parseInt(context.taxYear) === 2023 ? 1.07: 1.13;

		const result = Math.min((((Math.ceil(percentSaving))/100 - 0.25) * 100) * multiplier1 + multiplier2, multiplier3)
		return result.toFixed(2)
	}

	const calculatePwRateByYear = (percentSaving) => {
		const multiplier1 = parseInt(context.taxYear) === 2023 ? 0.11 : 0.1128;
		const multiplier2 = parseInt(context.taxYear) === 2023 ? 2.68 : 2.83;
		const multiplier3 = parseInt(context.taxYear) === 2023 ? 5.36 : 5.65;

		const result = Math.min((((Math.ceil(percentSaving))/100 - 0.25) * 100) * multiplier1 + multiplier2, multiplier3)
		return result.toFixed(2)
	}

	const handleValueChange = async (data) => {
		if (taxYear >= 2023) {
			for (const item of data) {
				let newRate = 0
				let pwNewRate = 0
				const percentSaving = parseIntSafe(item.percentsaving)

				newRate = calculateRateByYear(percentSaving);
				pwNewRate = calculatePwRateByYear(percentSaving);

				item.rate = newRate
				item.pwRate = pwNewRate
				item.percentSaving = percentSaving
			}
		} else {
			for (const item of data) {			
				let qualifiedDeduction = null;
				let newRate = null;
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
					showTotalType={{showTotal: true, type: 'Buildings'}}
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