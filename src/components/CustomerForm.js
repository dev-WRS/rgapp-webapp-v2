import { useState, useMemo } from 'react'
import PropTypes from 'prop-types'
import { useTheme } from '@emotion/react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Skeleton from '@mui/material/Skeleton'

import useForm from 'hooks/useForm'
import TextField from 'components/core/TextField'
import ColorField from 'components/core/ColorField'
import PhoneField from 'components/core/PhoneField'
import Button from 'components/core/Button'
import LoadingButton from 'components/core/LoadingButton'
import UploadImgField from 'components/core/UploadImgField'

import _ from 'lodash'

const validations = {
	name: ['required'],
	logo: ['required'],
	primaryColor: ['required']
}

const fields = ['name', 'address', 'phone', 'logo', 'primaryColor']
const tabsFields = {
	name: 0,
	address: 0,
	phone: 0,
	logo: 1,
	primaryColor: 1
}

function TabPanel(props) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`full-width-tabpanel-${index}`}
			aria-labelledby={`full-width-tab-${index}`}
			{...other}
		>
			{value === index && (
				<Box pt={4}>
					{children}
				</Box>
			)}
		</div>
	);
}

TabPanel.propTypes = {
	children: PropTypes.node,
	index: PropTypes.number.isRequired,
	value: PropTypes.number.isRequired,
};

const CustomerForm = ({
	record,
	open,
	isLoading,
	inProgress,
	onSubmit,
	onCancel
}) => {
	const theme = useTheme()
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
	const { state, formValidateWithErrors, getError, onValueChange, onBlur } = useForm({
		initialState: fieldsInitial,
		validations: fieldsValidator
	})

	const [value, setValue] = useState(0)

	const handleChange = (event, newValue) => {
		setValue(newValue)
	}

	const handleSubmit = event => {
		event.preventDefault()
		const { isValid, errors } = formValidateWithErrors()

		if (!isValid) {
			const fieldname = Object.keys(errors)[0]
			const newValue = tabsFields[fieldname]

			setValue(newValue)
		}

		if (onSubmit && isValid) {
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
						maxWidth: '388px',
						minWidth: '330px',
						minHeight: '388px'
					}
				}}
			>
				<DialogTitle>{(isLoading) ? <Skeleton /> : `${mode === 'add' ? 'Add' : 'Edit'} Customer`}</DialogTitle>
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
							<AppBar position="static"
								sx={{
									backgroundColor: 'white',
									boxShadow: 'none'
								}}
							>
								<Tabs
									value={value}
									onChange={handleChange}
									indicatorColor="secondary"
									textColor="secondary"
									variant="fullWidth"
								>
									<Tab label="Info" />
									<Tab label="Brand" />
								</Tabs>
							</AppBar>
							<TabPanel value={value} index={0} dir={theme.direction}>
								<TextField id="name" label="Name" disabled={inProgress}
									fullWidth
									size={'medium'}
									value={state.name}
									autoFocus
									onChange={onValueChange}
									onBlur={onBlur}
									{...getError('name')}
								/>
								<TextField id="address" label="Address" disabled={inProgress}
									fullWidth
									size={'medium'}
									value={state.address}
									onChange={onValueChange}
									onBlur={onBlur}
									{...getError('address')}
								/>
								<PhoneField id="phone" label="Phone" disabled={inProgress}
									fullWidth
									size={'medium'}
									value={state.phone}
									onChange={onValueChange}
									onBlur={onBlur}
									{...getError('phone')}
								/>
							</TabPanel>
							<TabPanel value={value} index={1} dir={theme.direction}>
								<UploadImgField disabled={inProgress}
									fullWidth
									id="logo"
									label="Logo"
									description="(138 x 32 px)"
									aspectRatio={[0.22, 0.28]}
									aspectRatioWarningMsg="This image does not have the required aspect ratio (height/width = 0.25), which could lead to unexpected results when used."
									allowClear={false}
									width={340}
									height={135}
									value={(_.isString(state.logo) && !_.isEmpty(state.logo)) ? `/api/assets/${state.logo}` : state.logo}
									onChange={onValueChange}
									// onBlur={onBlur}
									{...getError('logo')}
								/>
								<ColorField id="primaryColor" label="Color" disabled={inProgress}
									fullWidth
									size={'medium'}
									value={state.primaryColor}
									onChange={onValueChange}
									onBlur={onBlur}
									{...getError('primaryColor')}
								/>
							</TabPanel>
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

export default CustomerForm