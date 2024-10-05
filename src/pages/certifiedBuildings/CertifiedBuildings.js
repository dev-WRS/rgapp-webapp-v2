import { useEffect, useMemo, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import checkPermission from 'check-permission';

import CertifiedBuildingsList from 'components/CertifiedBuildingsList';

import ViewCertifiedBuilding from './ViewCertifiedBuilding';
import { exportToExcel } from './exportExcel';
import { fetchCertifiedBuildings } from 'actions';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';

const CertifiedBuildings = () => {
    const dispatch = useDispatch();
	const auth = useSelector((state) => state.auth && state.auth.data);
    const permissions = useSelector(state => state.permissions && state.permissions.data);
    const [isLoading, setLoading] = useState(false);
	const [isExporting, setExporting] = useState(false);
	const filteredBuildingsRef = useRef([]);
	const [isFiltered, setIsFiltered] = useState(false);
	const [filteredCount, setFilteredCount] = useState(0);
	const [selectedSumField, setSelectedSumField] = useState('total');
    const [sumResult, setSumResult] = useState(0);

	const actions = useMemo(() => [
        { key: 'view-certified-buildings', label: 'Edit', icon: 'eye', element: ViewCertifiedBuilding, disabled: (selection) => (selection.length !== 1 || selection[0].status === 'approved' || selection[0].status === 'closed'), default: true },
    ],[auth.role.name]);

    const certifiedBuildings = useSelector((state) => state.certifiedBuildings && state.certifiedBuildings.data);

    useEffect(() => {
        setLoading(true);
        dispatch(fetchCertifiedBuildings())
            .then(() => {setTimeout(() => setLoading(false), 2000);})
            .catch(() => setLoading(false));
    }, [dispatch]);

    const handleRefresh = () => {
        setLoading(true);
        dispatch(fetchCertifiedBuildings())
            .then(() => {setTimeout(() => setLoading(false), 2000);})
            .catch(() => setLoading(false));
    };
    const handleActionClose = (action, result) => {
        
	}

    const handleExport = () => {
        if ((isFiltered && filteredBuildingsRef.current.length > 0) || (certifiedBuildings && certifiedBuildings.length > 0)) {
            setExporting(true);
            const buildingsToExport = isFiltered ? filteredBuildingsRef.current : certifiedBuildings;
            exportToExcel(buildingsToExport).finally(() => {
                setExporting(false);
            });
        }
    };

	const handleFilteredBuildings = (filteredData) => {
        filteredBuildingsRef.current = filteredData;
		setIsFiltered(true);
        setFilteredCount(filteredData.length); 
    };

	const calculateSum = (field, data) => {
        if (!data || data.length === 0) {
            setSumResult(0);
            return;
        }

        if (field === 'percentSaving') {
            const totalPercentSaving = data.reduce((acc, building) => acc + (parseFloat(building.percentSaving) || 0), 0);
            const averagePercentSaving = totalPercentSaving / data.length;
            setSumResult(averagePercentSaving);
        } else if (field === 'total') {
            setSumResult(data.length);
        } else {
            const total = data.reduce((acc, building) => acc + (parseFloat(building[field]) || 0), 0);
            setSumResult(total);
        }
    };

	useEffect(() => {
        const dataToSum = isFiltered ? filteredBuildingsRef.current : certifiedBuildings;
        calculateSum(selectedSumField, dataToSum);
    }, [selectedSumField, certifiedBuildings, filteredCount, isFiltered]);

	const formatSumResult = () => {
        if (selectedSumField === 'area') {
            return `${sumResult.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} sqft`;
        }
        if (selectedSumField === 'deduction') {
            return `$${sumResult.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        }
        if (selectedSumField === 'percentSaving') {
            return `${sumResult.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`;
        }
        if (selectedSumField === 'total') {
            return `${sumResult.toLocaleString('en-US')} buildings`;
        }
        return sumResult.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

	const isButtonDisabled = isLoading || isExporting || 
        ((!isFiltered && (!certifiedBuildings || certifiedBuildings.length === 0)) ||
        (isFiltered && filteredCount === 0)); 

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '10px',
						 position: 'relative', zIndex: 1, }}>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={ handleExport }
                    disabled={ isButtonDisabled }
					style={{ color: 'white' }}
                >
                    Export Excel
                </Button>

                <FormControl variant="outlined" disabled= {isButtonDisabled} style={{ marginRight: '0px', marginLeft: '20px', minWidth: 200 }}>
                    <InputLabel id="sum-field-label">Calculate field</InputLabel>
                    <Select
                        labelId="sum-field-label"
                        value={selectedSumField}
                        onChange={(e) => setSelectedSumField(e.target.value)}
                        label="Calculate field"
                    >
                        <MenuItem value="total">Total</MenuItem>
                        <MenuItem value="area">Area</MenuItem>
                        <MenuItem value="deduction">Deduction</MenuItem>
                        <MenuItem value="percentSaving">Percent Saving</MenuItem>
                    </Select>
                </FormControl>

                {selectedSumField && (
                    <Typography variant="h6" style={{ marginLeft: '20px', marginTop: '10px' }}>
                        {`Total ${selectedSumField}: ${formatSumResult()}`}
                    </Typography>
                )}
            </div>

            <div style={{
                position: 'relative',
                height: 'calc(100% - 50px)',
                overflowY: 'auto',
            }}>
				<CertifiedBuildingsList
                	actions={actions.filter(item =>checkPermission(item, permissions))}
					certifiedBuildings={certifiedBuildings || []}
					defaultAction={actions.find((item) => item.default)}
					onRefresh={handleRefresh}
                    onActionClose={handleActionClose}
					isLoading={isLoading}
					onFilteredBuildings={handleFilteredBuildings}
				/>
			</div>
        </>
    );
};

export default CertifiedBuildings;
