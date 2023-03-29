import { useState, useEffect, useMemo } from 'react'
import { useTheme } from '@emotion/react'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import MuiFormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import Skeleton from '@mui/material/Skeleton'

import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

import Button from 'components/core/Button'
import LoadingButton from 'components/core/LoadingButton'

const FormControlLabel = styled(MuiFormControlLabel)(({ theme }) => ({
	width: '125px',
	'& .MuiCheckbox-root': {
		padding: theme.spacing(0.5)
	},
	'& .MuiTypography-root': {
		fontSize: '14px',
		lineHeight: '20px'
	}
}))

const asTree = actions => {
	return actions.reduce((result, action) => {
		if (result[action.group]) {
			result[action.group].push(action)	
		}
		else {
			result[action.group] = [action]
		}
		return result
	}, {})
}

const asId = ({ id }) => id

const RoleForm = ({
	open,
	role,
	actions,
	isReadOnly, 
	isLoading,
	inProgress, 
	onSubmit,
	onCancel 
}) => {
	const theme = useTheme()
	const [selection, setSelection] = useState(role ? role.actions.map(asId) : [])
	const actionGroups = useMemo(() => asTree(actions), [actions])

	useEffect(() => {
		if (role) {
			setSelection(role.actions.map(asId))
		}
	}, [role])

	const handleCheckChange = (action) => () => {
		const actionIndex = selection.findIndex((id) => action.id === id)
		const check = (actionIndex === -1)

		if (check) {
			selection.push(action.id)
		}
		else {
			selection.splice(actionIndex, 1)	
		}
		setSelection([...selection])
	}

	const handleSubmit = event => {
		event.preventDefault()
		if (onSubmit) {
			onSubmit(selection)
		}
	}

	return (
		<>
			<Dialog
				open={open}
				disableEscapeKeyDown
				PaperProps={{
					sx: {
						maxWidth: '500px',
						minWidth: '500px',
						minHeight: '500px'
					}
				}}
			>
				<DialogTitle>{(isLoading) ? <Skeleton/> : `Edit ${(role && role.name) || ''} Role`}</DialogTitle>
				{isLoading ? 
					<>
						<Skeleton variant="rectangular" component="div" sx={{ flex: 1, m: theme.spacing(0, 3, .5) }}/>
						<Skeleton sx={{ height: 64, m: theme.spacing(0, 3, 3) }}/>
					</> :
					<form autoComplete="off" noValidate onSubmit={handleSubmit}>
						<DialogContent
							sx={{
								padding: theme.spacing(1, 3, 0)
							}}
						>
						{Object.keys(actionGroups).map(name => (
							<Stack
								key={name}
								flexDirection="column"
								justifyContent="flex-start"
								alignItems="stretch"
							>
								<Typography variant="subtitle2">{name}</Typography>
								<Stack
									flexDirection="row"
									justifyContent="flex-start"
									flexWrap="wrap"
									sx={{
										ml: 4,
										my: 2
									}}
								>
									{actionGroups[name].map((action, index) => {
										const checked = (selection.findIndex((id) => action.id === id) !== -1)
										return (
											<FormControlLabel key={action.key}
												control={
													<Checkbox color="secondary"
														disabled={isReadOnly}
														checked={checked}
														onClick={handleCheckChange(action)}
													/>
												} 
												label={action.name}
											/>
										)
									})}
								</Stack>	
							</Stack>
						))}		
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
								disabled={isReadOnly || inProgress}
								loading={inProgress}
							>Submit</LoadingButton>
						</DialogActions>
					</form>
				}
			</Dialog>
		</>
	)
}

export default RoleForm