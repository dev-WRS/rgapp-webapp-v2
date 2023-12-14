import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'
import useForm from 'hooks/useForm'
import TextField from 'components/core/TextField'
import moment from 'moment'
import { useDispatch } from 'react-redux'
import { useState, useEffect } from 'react'

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
    const [isSearching, setIsSearching] = useState(false)
    const [operationSuccessfully, setOperationSuccessfully] = useState(null)
    const [deletedItems, setDeletedItems] = useState(0)
    const [dialogContextText, setDialogContextText] = useState(['Found', 'Are you sure you want to proceed with the deletion?'])

    useEffect(() => {
        switch (operationSuccessfully) {
            case true:
                setDialogContextText(['Deleted', ''])
                break
            case false:
                setDialogContextText(['Error at Delete', 'Please contact support!']) 
                break
            default:
                setDialogContextText(['Found', 'Are you sure you want to proceed with the deletion?'])  
                break
        }
	}, [operationSuccessfully])

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
        setOperationSuccessfully(null)
    }

    const handleSubmit = event => {
		event.preventDefault()
		if (formValidate()) {
            setIsLoading(true);
            if (projects && projects.length > 0) {
                const ids = projects.map(project => project.id);
                if (ids && ids.length > 0) {
                    dispatch(deleteProjects(ids)).then(() => {
                        setTimeout(() => {
                            setIsLoading(false)
                            setOperationSuccessfully(true)
                            setDeletedItems(projects.length)
                            setProjects([]);
                        } , 10000)
                    }).catch(() => {
                        setIsLoading(false)                        
                        setOperationSuccessfully(false)
                    })
                } else {
                    console.log("No projects to delete")
                }
            }
		}
	}

    const onSearch = event => {
		event.preventDefault()
        if (formValidate()) {
            setIsSearching(true);
            setOperationSuccessfully(null)
            dispatch(fetchProjectByReportDates(state.startDate, state.endDate))
            .then(({ payload, error, ...others }) => {
                if (error) {
                    setIsSearching(false)
                    return
                }
                setProjects(payload)
                setIsSearching(false)
            })
            .catch((error) => {
                setIsSearching(false);
            });
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
                    height: projects.length > 0 || operationSuccessfully !== null ? 280 : 200
				}}>
                    <TextField type="date" id="startDate" label="Start Date"
						fullWidth
                        value={state.startDate}
						size="medium"
						disabled={isLoading || isSearching}
						onChange={handleDateChange}
						onBlur={onBlur}
                        sx={{margin: '5px 0px 0px'}}
						{...getError('startDate')}
					/>
					<TextField type="date" id="endDate" label="End Date"
						fullWidth
                        value={state.endDate}
						size="medium"
						disabled={isLoading || isSearching}
						onChange={handleDateChange}
						onBlur={onBlur}
                        sx={{margin: '5px 0px 0px'}}
						{...getError('endDate')}
					/>
                    {
                        (projects.length > 0 || operationSuccessfully !== null) && (
                            <DialogContentText>
                                {dialogContextText[0]} {projects.length > 0 ? projects.length : deletedItems} projects with reports created between {moment(state.startDate).format('MMMM DD, YYYY')}, and {moment(state.startDate).format('MMMM DD, YYYY')}. {dialogContextText[1]}
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
						disabled={isLoading || isSearching}
						color="cancel"
						sx={{
							flex: 1
						}}
					>Cancel</Button>
                    {
                        (projects.length === 0 || operationSuccessfully === null || operationSuccessfully === true) && (
                            <LoadingButton variant="contained" color="secondary"
                            disabled={isLoading || isSearching}
                            loading={isSearching}
                            sx={{
                                color: 'white',
                                flex: 1
                            }}
                            onClick={onSearch}
                        >Search </LoadingButton>
                        )}
                    {
                        (projects.length > 0 || operationSuccessfully === false) && (
                            <LoadingButton type="submit" variant="contained" color="secondary"
                            disabled={isLoading || isSearching}
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