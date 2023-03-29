import { useEffect, useRef } from 'react'

const InputFile = ({
	name,
	accept,
	hidden, 
	open,
	onChange
}) => {
	const element = useRef()
	
	const handleChange = (event) => {
		onChange && onChange(event)
	}

	useEffect(() => {
		if (open && element.current) {
			element.current.click()
		}
	}, [open])

	return (
		<input ref={element} type="file"
			name={name}
			accept={accept}
			hidden={hidden}
			onChange={handleChange}
		/>
	)
}

export default InputFile