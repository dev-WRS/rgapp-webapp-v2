import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const ViewCertifiedBuilding = ({ selection, onClose }) => {
    const buildingData = selection && selection[0];

    return (
        <Dialog open={!!selection} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>Certified Building Details</DialogTitle>
            <DialogContent>
                {buildingData ? (
                    <Grid container spacing={3}>
                        <Grid item xs={4}>
                            <TextField
                                label="Project ID"
                                value={buildingData.projectId}
                                fullWidth
                                disabled
                                sx={{ mt: 3 }}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                label="Project Name"
                                value={buildingData.projectName}
                                fullWidth
                                disabled
                                sx={{ mt: 3 }}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                label="Tax Year"
                                value={buildingData.taxYear}
                                fullWidth
                                disabled
                                sx={{ mt: 3 }}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                label="Type"
                                value={buildingData.type}
                                fullWidth
                                disabled
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                label="State"
                                value={buildingData.state}
                                fullWidth
                                disabled
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                label="Private"
                                value={buildingData.privateProject ? 'Private' : 'Public'}
                                fullWidth
                                disabled
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                label="Customer"
                                value={buildingData.customer}
                                fullWidth
                                disabled
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                label="Certifier"
                                value={buildingData.certifier}
                                fullWidth
                                disabled
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                label="Inspection Date"
                                value={buildingData.inspectionDate}
                                fullWidth
                                disabled
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                label="Certified Date"
                                value={buildingData.certifiedDate}
                                fullWidth
                                disabled
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                label="Building Name"
                                value={buildingData.buildingName}
                                fullWidth
                                disabled
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                label="Legal Entity"
                                value={buildingData.legalEntity}
                                fullWidth
                                disabled
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                label="Address"
                                value={buildingData.address}
                                fullWidth
                                disabled
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                label="Area"
                                value={`${buildingData.area} sqft`}
                                fullWidth
                                disabled
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                label="Rate"
                                value={`$ ${buildingData.rate}`}
                                fullWidth
                                disabled
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                label="PW Rate"
                                value={`$ ${buildingData.pwRate}`}
                                fullWidth
                                disabled
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                label="Deduction"
                                value={`$ ${buildingData.deduction}`}
                                fullWidth
                                disabled
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                label="PW Deduction"
                                value={`$ ${buildingData.pwDeduction}`}
                                fullWidth
                                disabled
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                label="Percent Saving"
                                value={`${buildingData.percentSaving} %`}
                                fullWidth
                                disabled
                            />
                        </Grid>
                    </Grid>
                ) : (
                    <Typography>No details available</Typography>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary" variant="contained">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ViewCertifiedBuilding;
