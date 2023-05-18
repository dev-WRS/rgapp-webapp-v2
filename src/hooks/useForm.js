import { useEffect, useState } from 'react'

const defaultInvalidMessage = 'This field is invalid'
const validators = {
    required: {
        test: value => !!value,
        message: (name, value) => 'This field is required'
    },
    max: {
        test: (value, fieldValidator) => fieldValidator ? value <= fieldValidator.value : false,
        message: (name, value, fieldValidator) => `${value} is grather than ${fieldValidator.value}`
    },
	rangeNumber: {
        test: (value, fieldValidator) => {
			return fieldValidator ? parseInt(value) >= fieldValidator.minValue && parseInt(value) <= fieldValidator.maxValue : false
		},
        message: (name, value, fieldValidator) => `Must be between ${fieldValidator.minValue} and ${fieldValidator.maxValue}`
    },
	minLength: {
        test: (value, fieldValidator) => fieldValidator ? value.length > fieldValidator.value : false,
        message: (name, value, fieldValidator) => `Must be greater than ${fieldValidator.value}`
    },
	hasUpperCase: {
		test: (value) => validators.regex.test(value, { sequence: /(?=.*[A-Z])/ }),
		message: (name, value, fieldValidator) => `Must contain a upper case`
	},
	hasLowerCase: {
		test: (value) => validators.regex.test(value, { sequence: /(?=.*[a-z])/ }),
		message: (name, value, fieldValidator) => `Must contain a lower case`
	},
	hasNumber: {
		test: (value) => validators.regex.test(value, { sequence: /\d/ }),
		message: (name, value, fieldValidator) => `Must contain a number`
	},
	hasSpecialCharacter: {
		test: (value) => validators.regex.test(value, { sequence: /(\W)/ }),
		message: (name, value, fieldValidator) => `Must contain a special character`
	},
	regex: {
		test: (value, fieldValidator) => (value && fieldValidator.sequence) ? (new RegExp(fieldValidator.sequence)).test(value) : true,
		message: (name, value, fieldValidator) => fieldValidator.message || defaultInvalidMessage
	},
	match: {
		test: (value, fieldValidator, values) => (value && fieldValidator.name) ? (value === values[fieldValidator.name]) : true,
		message: (name, value, fieldValidator) => fieldValidator.message || defaultInvalidMessage
	},
    email: {
        // eslint-disable-next-line no-useless-escape
        test: value => value ? /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(value) : true,
        message: (name, value) => defaultInvalidMessage
    },
    phone: {
        test: value => value ? /^(\+?1)?[-.\s]?\(?(\d{3,3})[)-.\s]{0,2}(\d{3,3})[-.\s]?(\d{4,4})\s*$/i.test(value) : true,
        message: (name, value) => defaultInvalidMessage
    },
    url: {
        test: value => value ? /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm.test(value) : true,
        message: (name, value) => defaultInvalidMessage
    },
	notEmptyList: {
        test: value => value.length > 0,
        message: (name, value) => 'The list should have at least one element'
    },
}

const validate = validations => values => {
    return Object.keys(validations).reduce((errors, name) => {
        const fieldValidators = validations[name] || []
        let isValid = true

        for(let i = 0, ln = fieldValidators.length; i < ln && isValid; i++) {
            const fieldValidator = fieldValidators[i]
            const validatorId = typeof fieldValidator === 'string' ? fieldValidator : fieldValidator.type
            const validator = validators[validatorId]

            if (validator) {
                isValid = validator.test(values[name], fieldValidator, values)
                if (!isValid) errors[name] = validator.message(name, values[name], fieldValidator)
            }
        }
        return errors
    }, {})
}

const useForm = ({ 
	initialState,
	validations 
}) => {
    const [state, setState] = useState(initialState || {})
    const [errors, setErrors] = useState({})

    const onValueChange = event => {
        const { id, name, value, files = [], extraValues = {} } = event.target
		const fieldname = id || name
		const fieldvalue = (files && files[0]) ? files[0] : value

        setState(prevState => ({ ...prevState, ...extraValues, [fieldname]: fieldvalue }))
		fieldValidate(fieldname, fieldvalue)
    }

    const onBlur = event => {
		const { id, name, value } = event.target
		const fieldname = id || name
    }

	const fieldValidate = (fieldname, value) => {
		const validationErros = validate({
			[fieldname]: validations[fieldname]
		})({ 
			...state,
			[fieldname]: value
		})
		
		setErrors(prevErrors => {
			const newErrors = {...prevErrors}
			
			if (validationErros[fieldname]) {
				newErrors[fieldname] = validationErros[fieldname]
			}
			else {
				delete newErrors[fieldname]
			}
			return newErrors
		})
	}

	const formValidate = (validationsPassed = undefined) => {
		validations = validationsPassed || validations;
		const validationErros = validate(validations)(state)
		
		setErrors(validationErros)
		return (Object.keys(validationErros).length === 0)
	}

	const formValidateWithErrors = () => {
		const validationErros = validate(validations)(state)
		
		setErrors(validationErros)
		return {
			isValid: (Object.keys(validationErros).length === 0),
			errors: validationErros
		}
	}

	const isFieldValid = (fieldname) => !errors[fieldname]

	const getError = (fieldname) => {
		const message = errors[fieldname]

		return message ? { error: true, helperText: message } : { error: false, helperText: undefined }
	}

	const getErrors = () => errors

	return { 
		state, 
		formValidate,
		formValidateWithErrors, 
		isFieldValid, 
		getError, 
		getErrors, 
		onValueChange, 
		onBlur 
	}
}

export default useForm