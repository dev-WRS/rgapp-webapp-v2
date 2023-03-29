import { useState, useMemo } from 'react'
import PropTypes from 'prop-types';
import { useTheme } from '@emotion/react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Stack from '@mui/material/Stack'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Skeleton from '@mui/material/Skeleton'

import useForm from 'hooks/useForm'
import TextField from 'components/core/TextField'
import OutlinedListField from 'components/core/OutlinedListField'
import IconButton from 'components/core/IconButton'
import SelectStateField from 'components/core/SelectStateField'
import PhoneField from 'components/core/PhoneField'
import Button from 'components/core/Button'
import LoadingButton from 'components/core/LoadingButton'
import MuiIconButton from '@mui/material/IconButton'
import UploadImgField from 'components/core/UploadImgField'

import { Icon } from 'styles';
import _ from 'lodash'

const validations = {
	name: ['required'],
	address: ['required'],
	phone: ['required'],
	signature: ['required'],
	licenses: ['notEmptyList']
}

const fields = ['name', 'address', 'phone', 'licenses', 'signature']
const tabsFields = {
	name: 0,
	address: 0,
	phone: 0,
	licenses: 1,
	signature: 2
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

const CertifierForm = ({
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

	const [license, setLicense] = useState({ state: '', number: '' })
	const [licenses, setLicenses] = useState(state.licenses || [])
	const [value, setValue] = useState(0);

	const handleChange = (event, newValue) => {
		setValue(newValue);
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

	const onLicenseChange = event => {
		const { id, name, value, extraValues = {} } = event.target
		const fieldname = id || name

		setLicense(prevState => ({ ...prevState, ...extraValues, [fieldname]: value }))
	}

	const handleAddLicense = (event) => {
		const newLicenses = [...licenses]

		newLicenses.unshift(license)
		setLicenses(newLicenses)

		onValueChange({ target: { id: 'licenses', value: newLicenses } })

		setLicense({ state: '', number: '' })
	}

	const handleDeleteLicense = (index) => (event) => {
		const newLicenses = [...licenses]

		newLicenses.splice(index, 1)
		setLicenses(newLicenses)

		onValueChange({ target: { id: 'licenses', value: newLicenses } })
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
				<DialogTitle>{(isLoading) ? <Skeleton /> : `${mode === 'add' ? 'Add' : 'Edit'} Certifier`}</DialogTitle>
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
									<Tab label="Licenses" />
									<Tab label="Signature" />
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
								<Stack direction="row" spacing={2} width='340px'>
									<SelectStateField id="state" label="State" disabled={inProgress}
										fullWidth
										size={'medium'}
										value={license.state}
										onChange={onLicenseChange}
										onBlur={onBlur}
										{...getError('state')}
									/>
									<TextField id="number" label="Number" disabled={inProgress}
										fullWidth
										size={'medium'}
										value={license.number}
										onChange={onLicenseChange}
										onBlur={onBlur}
										{...getError('number')}
									/>
									<Box pt={'10px'}>
										<IconButton disabled={(license.state === '' || license.number === '') || inProgress} onClick={handleAddLicense} icon={'plus'} size={22} color={'white'} />
									</Box>
								</Stack>
								<OutlinedListField 
									label={licenses.length === 0 ? 'Registered Licenses' : 'Registered Licenses'.concat(' (', licenses.length, ')')} 
									isEmpty={licenses.length === 0} 
									inProgress={inProgress}
									{...getError('licenses')}
									>
									<List sx={{ maxHeight: '90px', height: '90px', overflow: 'scroll' }}>
										{licenses.map((license, index) => (
											<ListItem key={index}
												secondaryAction={
													<MuiIconButton disabled={inProgress}
														onClick={handleDeleteLicense(index)}
														sx={{ marginRight: .5, marginLeft: .5, stroke: theme.palette.text.primary, strokeWidth: "15px" }}
														edge='end'
													>
														<Icon icon='close' size={15} color={theme.palette.text.primary} />
													</MuiIconButton>
												}>
												<ListItemText
													primary={license.state.concat(', ', license.number)}
												/>
											</ListItem>
										))}
									</List>
								</OutlinedListField>
							</TabPanel>
							<TabPanel value={value} index={2} dir={theme.direction}>
								<UploadImgField inProgress={inProgress}
									fullWidth
									id="signature"
									label="Signature"
									description="(138 x 32 px)"
									allowClear={false}
									width={340}
									height={135}
									value={(_.isString(state.signature) && !_.isEmpty(state.signature)) ? `/api/assets/${state.signature}` : state.signature}
									onChange={onValueChange}
									// onBlur={onBlur}
									{...getError('signature')}
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

export default CertifierForm