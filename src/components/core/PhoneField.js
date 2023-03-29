import { forwardRef } from 'react'
import NumberFormat from 'react-number-format'

import TextField from 'components/core/TextField'

const InputNumberFormat = forwardRef((props, ref) => {
	const { id, name , onChange, ...others } = props
	return  (
		<NumberFormat
			{...others}
			getInputRef={ref}
			onValueChange={values => {
				onChange({
					target: {
						id,
						name,
						value: values.value,
					}
				})
			}}
			format="(###) ###-####"
			placeholder="(###) ###-####"
			mask={['#', '#', '#', '#', '#', '#', '#', '#', '#', '#']}
			isNumericString
		/>
	)
})

const PhoneField = (props) => {
    return (
        <TextField
            InputProps={{
				inputComponent: InputNumberFormat
            }}
            {...props}
        />
    )
}

export default PhoneField