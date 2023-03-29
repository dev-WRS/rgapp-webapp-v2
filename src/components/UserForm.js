import { useTheme } from '@emotion/react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Skeleton from '@mui/material/Skeleton'

import useForm from 'hooks/useForm'
import TextField from 'components/core/TextField'
import PhoneField from 'components/core/PhoneField'
import SelectField from 'components/core/SelectField'
import Button from 'components/core/Button'
import LoadingButton from 'components/core/LoadingButton'
import { useMemo } from 'react'

const validations = {
	name: ['required'], 
	email: ['required', 'email'],
	role: ['required']
}

const fields = {
	add: ['name', 'email', 'phone', 'role'],
	edit: ['name', 'phone', 'role']
}

const has = (name, mode) => (fields[mode].indexOf(name) !== -1)

const UserForm = ({
	record,
	open,
	roles = [], 
	isLoading, 
	inProgress,
	onSubmit,
	onCancel 
}) => {
	const theme = useTheme()
	const mode = useMemo(() => (record && record.id ? 'edit' : 'add'), [record])
	const fieldsInitial = useMemo(() => {
		return fields[mode].reduce((result, name) => {
			result[name] = record ? record[name] : ''
			return result
		}, {}) 
	}, [mode, record])
	const fieldsValidator = useMemo(() => {
		return fields[mode].reduce((result, name) => {
			if (validations[name]) result[name] = validations[name]
			return result
		}, {})
	}, [mode])
	const { state, formValidate, getError, onValueChange, onBlur } = useForm({
		initialState: fieldsInitial,
		validations: fieldsValidator
	})

	const handleSubmit = event => {
		event.preventDefault()
		if (onSubmit && formValidate()) {
			onSubmit(state)
		}
	}

	return (
		<>
			<Dialog
				open={open}
				disableEscapeKeyDown
				PaperProps={{
					sx: {
						maxWidth: '350px',
						minWidth: '300px',
						minHeight: '350px'
					}
				}}
			>
				<DialogTitle>{(isLoading) ? <Skeleton/> : `${mode === 'add' ? 'Add' : 'Edit'} User`}</DialogTitle>
				{isLoading ? 
					<>
						<Skeleton variant="rectangular" component="div" sx={{ flex: 1, m: theme.spacing(0, 3, .5) }}/>
						<Skeleton sx={{ height: 64, m: theme.spacing(0, 3, 3) }}/>
					</> :
					<form autoComplete="off" noValidate onSubmit={handleSubmit}>
						<DialogContent
							sx={{
								padding: theme.spacing(1, 3, 1)
							}}
						>
							<TextField id="name" label="Name" disabled={inProgress}
								fullWidth
								size={'medium'}
								value={state.name}
								autoFocus
								onChange={onValueChange}
								onBlur={onBlur}
								{...getError('name')}
							/>
							{has('email', mode) && (
								<TextField id="email" label="Email" disabled={inProgress}
									fullWidth
									size={'medium'}
									value={state.email}
									onChange={onValueChange}
									onBlur={onBlur}
									{...getError('email')}
								/>
							)}
							<PhoneField id="phone" label="Phone" disabled={inProgress}
								fullWidth
								size={'medium'}
								value={state.phone}
								onChange={onValueChange}
								onBlur={onBlur}
								{...getError('phone')}
							/>
							<SelectField id="role" label="Role" disabled={inProgress}
								fullWidth
								valueProp="id"
								textProp="name"
								size={'medium'}
								value={state.role}
								options={roles}
								onChange={onValueChange}
								onBlur={onBlur}
								{...getError('role')}
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

export default UserForm