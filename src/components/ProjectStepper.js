import { useState, useMemo } from 'react'
import { useTheme } from '@emotion/react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'

import Button from 'components/core/Button'
import Box from '@mui/material/Box'

import ProjectInfo from '../pages/projects/projectInfo/ProjectInfo'
import Buildings from '../pages/projects/buildings/Buildings'
import DwellingInfo from '../pages/projects/dwellingInfo/DwellingInfo'
import DwellingUnits from '../pages/projects/dwellingUnits/DwellingUnits'
import Certifier from '../pages/projects/certifier/Certifier'
import Customer from '../pages/projects/customer/Customer'
import Photos from '../pages/projects/photos/Photos'
import PDFs from '../pages/projects/pdfs/PDFs'
import { useSelector } from 'react-redux'

const initialSteps = [
	{ name: 'Project Info', label: 'Please search by Project ID to automatically fill in basic information.', component: ProjectInfo, types: null, roles: null },
	{ name: 'Buildings', label: 'Please enter Building(s) information before continue.', component: Buildings, types: ['179D'], roles: ['Admin', 'Agent', 'Staff'] },
	{ name: 'Dwelling Info', label: 'Please enter general Dwelling Unit information before continue.', component: DwellingInfo, types: ['45L'], roles: ['Admin', 'Agent', 'Staff'] },
	{ name: 'Dwelling Units', label: 'Please enter Dwelling Unit(s) information before continue.', component: DwellingUnits, types: ['45L'], roles: ['Admin', 'Agent', 'Staff'] },
	{ name: 'Certifier', label: 'Please select a Certifier before continue.', component: Certifier, types: ['45L', '179D'], roles: ['Admin', 'Agent'] },
	{ name: 'Customer', label: 'Please select a Customer before continue.', component: Customer, types: ['45L', '179D'], roles: ['Admin', 'Agent'] },
	{ name: 'Photos', label: 'Please import Inspection Photos (if needed) before continue.', component: Photos, types: ['45L', '179D'], roles: ['Admin', 'Agent', 'Staff'] },
	{ name: 'PDFs', label: 'Please import external PDFs (if needed) before continue.', component: PDFs, types: ['45L', '179D'], roles: ['Admin', 'Agent', 'Staff'] },
]

const ProjectStepper = ({
	selection,
	open,
	isLoading,
	inProgress,
	onSubmit,
	onCancel
}) => {
	const theme = useTheme()
	const auth = useSelector(state => state.auth && state.auth.data)
	const selectionId = (selection && selection[0]) ? selection[0].id : null
	const mode = useMemo(() => (selectionId ? 'edit' : 'add'), [selectionId])

	const [activeStep, setActiveStep] = useState(0)
	const [submit, setSubmit] = useState(false)
	const [projectId, setProjectId] = useState()
	const [originalProjectID, setOriginalProjectID] = useState()
	const [steps, setSteps] = useState(initialSteps)
	const StepPage = steps[activeStep].component

	const handleNext = () => {
		setSubmit(true)
	}

	const handleBack = () => {
		setActiveStep((prevActiveStep) => prevActiveStep - 1)
	}

	const handleSubmit = (submitted, project) => {
		if (submitted) {
			let newSteps = steps

			if (project) {
				setProjectId(project.id)
				setOriginalProjectID(project.originalProjectID)

				newSteps = initialSteps.filter(step => (!step.types || (step.types && step.types.indexOf(project.reportType) !== -1 && (step.roles && step.roles.indexOf(auth.role.name) !== -1))))
				setSteps(newSteps)
			}
							
			if (activeStep < newSteps.length - 1) {
				setActiveStep(prevActiveStep => prevActiveStep + 1)
			}
		} 
		setSubmit(false)
	}

	return (
		<>
			<Dialog
				open={open}
				disableEscapeKeyDown
				PaperProps={{
					sx: {
						maxWidth: '600px',
						minWidth: '600px',
						minHeight: '300px'
					}
				}}
			>
				<DialogTitle>{(isLoading) ? <Skeleton /> : `${mode === 'add' ? 'Add' : 'Edit'} Project`}</DialogTitle>
				{isLoading ?
					<>
						<Skeleton variant="rectangular" component="div" sx={{ flex: 1, m: theme.spacing(0, 3, .5) }} />
						<Skeleton sx={{ height: 64, m: theme.spacing(0, 3, 3) }} />
					</> :
					<>
						<DialogContent
							sx={{
								padding: theme.spacing(1, 3, 0)
							}}
						>
							<Box sx={{
								pt: 1
							}}>
								<Typography pb={3}>{steps[activeStep].label}</Typography>
								<StepPage
									mode={mode}
									open={true}
									inProgress={inProgress}
									projectId={mode === 'edit' ? selectionId : projectId }
									originalProjectID={originalProjectID}
									onSubmit={handleSubmit}
									submit={submit}
									//onError={handleError}
									//onDirty={handleDirty}
								/>
							</Box>
						</DialogContent>
						<DialogActions
							sx={{
								padding: theme.spacing(1, 3, 4)
							}}
						>
							{activeStep !== 0 && (
								<Button variant="contained"
									sx={{ color: 'white', width: '120px' }}
									color="primary"
									disabled={inProgress}
									onClick={handleBack}

								>Previous</Button>
							)}
							<div style={{ flex: '1 0 0' }} />
							<Button variant="outlined"
								sx={{ width: '120px' }}
								color="cancel"
								disabled={inProgress}
								onClick={onCancel}
								width={120}
							>Cancel</Button>
							<Button variant="contained"
								sx={{ color: 'white', width: '120px' }}
								color="primary"
								disabled={inProgress}
								onClick={activeStep === steps.length - 1 ? onCancel : handleNext}
								width={120}
							>{activeStep === steps.length - 1 ? 'Finish' : 'Next'}</Button>
							{/* <LoadingButton type="submit" variant="contained"
								sx={{ color: 'white' }}
								color="secondary"
								fullWidth
								disabled={inProgress}
								loading={inProgress}
							>Submit</LoadingButton> */}
						</DialogActions>
					</>
				}
			</Dialog>
		</>
	)
}

export default ProjectStepper