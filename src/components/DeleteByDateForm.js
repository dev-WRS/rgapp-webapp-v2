import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'
import useForm from 'hooks/useForm'
import TextField from 'components/core/TextField'
import moment from 'moment'
import { useDispatch } from 'react-redux'
import { useState } from 'react'

import Button from 'components/core/Button'
import LoadingButton from 'components/core/LoadingButton'
import { fetchProjectByReportDates} from 'actions'
import { deleteProjects } from 'actions'

const validations = {
    startDate: ['required',
    {
        type: 'isAfter',
        name: 'endDate',
        message: 'Start date cannot be after end date'
    },
    {
        type: 'isBefore',
        message: 'Start date cannot be more than 5 years ago'
    }],
    endDate: ['required', {
        type: 'futureDate',
        message: 'End date cannot be in the future'
    }]
}

const DeleteByDateForm = ({
    open,
    onSubmit,
    onCancel
}) => {
    const dispatch = useDispatch()
    const currentDate = moment();
    const minStartDate = currentDate.clone().subtract(1, 'years').format('YYYY-MM-DD')
    const [projects, setProjects] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const { state, formValidate, getError, onValueChange, onBlur } = useForm(
        { initialState: {
            startDate: minStartDate,
            endDate: currentDate.format('YYYY-MM-DD'),
        },
        validations
    })

    const handleDateChange = (event) => {
        onValueChange({ target: { id: event.target.id, value: event.target.value } })
        setProjects([])
    }

    const handleSubmit = event => {
		event.preventDefault()
		if (formValidate()) {
            setIsLoading(true);
            if (projects && projects.length > 0) {
                const ids = projects.map(project => project.id);
                if (ids && ids.length > 0) {
                    const { error } = dispatch(deleteProjects(ids))
                    console.log("Error:", error)  
                } else {
                    console.log("No projects to delete")
                }
            } else {
                dispatch(fetchProjectByReportDates(state.startDate, state.endDate))
                .then(({ payload, error, ...others }) => {
                    if (error) {
                        console.error("Error fetching projects:", error)
                        setIsLoading(false)
                        return
                    }
                    setProjects(payload)
                    setTimeout(() => setIsLoading(false), 2000)
                    setIsLoading(false)
                })
                .catch((error) => {
                    console.error(`Error fetching projects. Timeout reached. ${error}`)
                    setIsLoading(false);
                });
            }
		}
	}

    return (
        <Dialog open={open}>
            <form autoComplete="off" noValidate onSubmit={handleSubmit}>
                <DialogTitle>Delete Projects by Reports date</DialogTitle>
                <DialogContent sx={{
                    top: '10px',
					padding: '0px 24px',
					width: 400,
                    height: projects.length > 0 ? 280 : 200
				}}>
                    <TextField type="date" id="startDate" label="Start Date"
						fullWidth
                        value={state.startDate}
						size="medium"
						disabled={isLoading}
						onChange={handleDateChange}
						onBlur={onBlur}
                        sx={{margin: '5px 0px 0px'}}
						{...getError('startDate')}
					/>
					<TextField type="date" id="endDate" label="End Date"
						fullWidth
                        value={state.endDate}
						size="medium"
						disabled={isLoading}
						onChange={handleDateChange}
						onBlur={onBlur}
                        sx={{margin: '5px 0px 0px'}}
						{...getError('endDate')}
					/>
                    {
                        (projects && projects.length > 0) && (
                            <DialogContentText>
                                Found {projects.length} projects with reports created between {moment(state.startDate).format('MMMM DD, YYYY')}, and {moment(state.startDate).format('MMMM DD, YYYY')}. Are you sure you want to proceed with the deletion?
                            </DialogContentText>
                        )
                    }

                </DialogContent>
                <DialogActions sx={{
					paddingLeft: 3,
					paddingRight: 3,
					paddingBottom: 3
				}}>
					<Button variant="outlined" onClick={onCancel}
						disabled={isLoading}
						color="cancel"
						sx={{
							flex: 1
						}}
					>Cancel</Button>
                    {
                        (projects === undefined || (projects && projects.length === 0)) && (
                            <LoadingButton type="submit" variant="contained" color="secondary"
                            disabled={isLoading}
                            loading={isLoading}
                            sx={{
                                color: 'white',
                                flex: 1
                            }}
                        >Search </LoadingButton>
                        )}
                    {
                        (projects && projects.length > 0) && (
                            <LoadingButton type="submit" variant="contained" color="secondary"
                            disabled={isLoading}
                            loading={isLoading}
                            sx={{
                                color: 'white',
                                flex: 1
                            }}
                            >Delete </LoadingButton>
                        )
                    }

				</DialogActions>
            </form>
        </Dialog>
    )
}

export default DeleteByDateForm