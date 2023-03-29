import { forwardRef } from 'react'
import NumberFormat from 'react-number-format'

import TextField from 'components/core/TextField'

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
			decimalScale={0}
			thousandSeparator
			isNumericString
			allowNegative={false}
			isAllowed={({ floatValue }) => (floatValue !== undefined ? floatValue > 0 : true)}
		/>
	)
})

const NumberField = (props) => {
    return (
        <TextField
            InputProps={{
				inputComponent: InputNumberFormat
            }}
            {...props}
        />
    )
}

export default NumberField