import { useMemo, useRef } from 'react'
import { useTheme } from '@emotion/react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Stack from '@mui/material/Stack'
import Skeleton from '@mui/material/Skeleton'

import useForm from 'hooks/useForm'
import TextField from 'components/core/TextField'
import Button from 'components/core/Button'
import LoadingButton from 'components/core/LoadingButton'

import _ from 'lodash'

const validations = {
	address: ['required']
}

const fields = ['address', 'type', 'model' /*, 'building', 'unit'*/]

const DwellingUnitForm = ({
	record,
	open,
	msgState,
	showMsgState,
	isLoading,
	inProgress,
	onSubmit,
	onCancel
}) => {
	const theme = useTheme()
	const ref = useRef()
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

	const { state, formValidate, getError, getErrors, onValueChange, onBlur } = useForm({
		initialState: fieldsInitial,
		validations: fieldsValidator
	})

	const handleSubmit = async (event) => {
		event.preventDefault()
		const isValid = formValidate()

		if (isValid) {
			onSubmit && onSubmit(state)
		}
	}

	return (
		<>
			<Dialog
				open={open}
				disableEscapeKeyDown
				PaperProps={{
					sx: {
						maxWidth: '580px',
						minWidth: '580px'
						//minHeight: '388px'
					}
				}}
			>
				<DialogTitle>{(isLoading) ? <Skeleton /> : `${mode === 'add' ? 'Add' : 'Edit'} Dwelling Unit`}</DialogTitle>
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
							<TextField id="address" label="Address" disabled={inProgress}
								fullWidth
								size={'medium'}
								value={state.address}
								onChange={onValueChange}
								onBlur={onBlur}
								{...getError('address')}
							/>
						<Stack direction="row" spacing={2}>
								<TextField id="model" label="Model" disabled={inProgress}
									fullWidth
									size={'medium'}
									value={state.model}
									onChange={onValueChange}
									onBlur={onBlur}
									{...getError('model')}
								/>
								<TextField id="type" label="Type" disabled={inProgress}
									fullWidth
									size={'medium'}
									value={state.type}
									onChange={onValueChange}
									onBlur={onBlur}
									{...getError('type')}
								/>
							</Stack>
							{/* <Stack direction="row" spacing={2}>
								<TextField id="building" label="Building" disabled={inProgress}
									fullWidth
									size={'medium'}
									value={state.building}
									onChange={onValueChange}
									onBlur={onBlur}
									{...getError('building')}
								/>
								<TextField id="unit" label="Unit" disabled={inProgress}
									fullWidth
									size={'medium'}
									value={state.unit}
									onChange={onValueChange}
									onBlur={onBlur}
									{...getError('unit')}
								/>
							</Stack> */}
						</DialogContent>
						<DialogActions
							sx={{
								padding: theme.spacing(1, 3, 4)
							}}
						>
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

export default DwellingUnitForm