import { forwardRef } from 'react'
import NumberFormat from 'react-number-format'

import TextField from 'components/core/TextField'
import InputAdornment from '@mui/material/InputAdornment'

const InputNumberFormat = forwardRef((props, ref) => {
	const { id, onChange, ...others } = props
	return  (
		<NumberFormat
			{...others}
			getInputRef={ref}
			onValueChange={values => {
				onChange({
					target: {
						name: id,
						value: values.value,
					}
				})
			}}
			decimalScale={2}
			fixedDecimalScale
			thousandSeparator
			isNumericString
			allowNegative={false}
			isAllowed={({ floatValue }) => (floatValue !== undefined ? floatValue > 0 : true)}
		/>
	)
})

const CurrencyField = (props) => {
    return (
        <TextField
            InputProps={{
				inputComponent: InputNumberFormat,
				startAdornment: <InputAdornment position="start">$</InputAdornment>
            }}
            {...props}
        />
    )
}

export default CurrencyField