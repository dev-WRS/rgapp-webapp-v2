import { useMemo } from 'react'
import { useTheme } from '@emotion/react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Skeleton from '@mui/material/Skeleton'

import useForm from 'hooks/useForm'
import SelectField from 'components/core/SelectField'
import Button from 'components/core/Button'
import LoadingButton from 'components/core/LoadingButton'


const validations = {
	status: ['required']
}

const fields = ['status']

const ProjectStatusChangeForm = ({
	record,
	open,
	isLoading,
	inProgress,
	onSubmit,
	onCancel
}) => {
	const theme = useTheme()
	const fieldsValidator = useMemo(() => {
		return fields.reduce((result, name) => {
			if (validations[name]) result[name] = validations[name]
			return result
		}, {})
	}, [])
	const { state, formValidateWithErrors, getError, onValueChange, onBlur } = useForm({
		validations: fieldsValidator
	})

	const handleSubmit = event => {
		event.preventDefault()
		const { isValid } = formValidateWithErrors()

		if (onSubmit && isValid) {
			onSubmit(state)
		}
	}

	let options = []

	switch (record.status) {
		case 'readyForReview':
			options = [
				{ 'text': 'Dale', id: 'approved' },
				{ 'text': 'In Progress', id: 'inProgress' }
			]
			break;
		case 'approved':
			options = [
				{ 'text': 'Closed', id: 'closed' },
				{ 'text': 'In Progress', id: 'inProgress' }
			]
			break;
		case 'closed':
			options = [
				{ 'text': 'In Progress', id: 'inProgress' }
			]
			break;
		default:
			options = [
				{ 'text': 'Ready for review', id: 'readyForReview' }
			]
			break;
	}

	return (
		<>
			<Dialog
				open={open}
				disableEscapeKeyDown
				PaperProps={{
					sx: {
						maxWidth: '388px',
						minWidth: '330px'
					}
				}}
			>
				<DialogTitle>{(isLoading) ? <Skeleton /> : 'Change Project Status'}</DialogTitle>
				{isLoading ?
					<>
						<Skeleton variant="rectangular" component="div" sx={{ flex: 1, m: theme.spacing(0, 3, .5) }} />
						<Skeleton sx={{ height: 64, m: theme.spacing(0, 3, 3) }} />
					</> :
					<form autoComplete="off" noValidate onSubmit={handleSubmit}>
						<DialogContent
							sx={{
								padding: theme.spacing(1, 3, 0)
							}}
						>
							<SelectField id="status" label="Status" disabled={inProgress}
								fullWidth
								valueProp="id"
								textProp="text"
								size={'medium'}
								value={state.status || ''}
								options={options}
								onChange={onValueChange}
								onBlur={onBlur}
								{...getError('status')}
							/>
						</DialogContent>
						<DialogActions
							sx={{
								padding: theme.spacing(1, 3, 4)
							}}
						>
							<Button variant="outlined"
								color="cancel"
								fullWidth
								disabled={inProgress}
								onClick={onCancel}
							>Cancel</Button>
							<LoadingButton type="submit" variant="contained"
								sx={{ color: 'white' }}
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

export default ProjectStatusChangeForm