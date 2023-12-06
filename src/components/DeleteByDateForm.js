import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import useForm from 'hooks/useForm'
import TextField from 'components/core/TextField'
import moment from 'moment'

import Button from 'components/core/Button'
import LoadingButton from 'components/core/LoadingButton'

const validations = {
    startDate: ['required'],
    endDate: ['required']
}

const DeleteByDateForm = ({
    open,
    isLoading,
    onCancel
}) => {
    const currentDate = moment();
    const minStartDate = currentDate.clone().subtract(5, 'years').format('YYYY-MM-DD');

    const { state, formValidate, getError, onValueChange, onBlur } = useForm(
        { initialState: { 
            startDate: minStartDate,
            endDate: currentDate.format('YYYY-MM-DD'),
        },
        validations 
    })

    validations.startDate.push((value) => {
        const endDate = moment(state.endDate);
        const startDate = moment(value);
    
        if (startDate.isAfter(endDate)) {
          return 'Start date cannot be after end date';
        }
    
        if (startDate.isBefore(moment(minStartDate))) {
          return `Start date cannot be more than 5 years ago (${minStartDate})`;
        }
    
        return null;
      });
    
      validations.endDate.push((value) => {
        const endDate = moment(value);
    
        if (endDate.isAfter(currentDate)) {
          return 'End date cannot be in the future';
        }
    
        return null;
      });
	
    const handleSubmit = event => {
		event.preventDefault()
		if (formValidate()) {
			console.log('Submit')
		}
	}

    return (
        <Dialog open={open}>
            <form autoComplete="off" noValidate onSubmit={handleSubmit}>
                <DialogTitle>Delete reports by dates</DialogTitle>
                <DialogContent sx={{
                    top: '10px',
					padding: '0px 24px',
					width: 400,
                    height: 200
				}}>
                    <TextField type="date" id="startDate" label="Start Date"
						fullWidth
                        value={state.startDate}
						size="medium"
						disabled={isLoading}
						onChange={onValueChange}
						onBlur={onBlur}
                        sx={{margin: '10px 0px 10px'}}
						{...getError('startDate')}
					/>
					<TextField type="date" id="endDate" label="End Date"
						fullWidth
                        value={state.endDate}
						size="medium"
						disabled={isLoading}
						onChange={onValueChange}
						onBlur={onBlur}
						{...getError('endDate')}
					/>
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
					<LoadingButton type="submit" variant="contained" color="secondary"
						disabled={isLoading}
						loading={isLoading}
						sx={{
							color: 'white',
							flex: 1
						}}
					>Submit</LoadingButton>
				</DialogActions>
            </form>
        </Dialog>
    )
}

export default DeleteByDateForm