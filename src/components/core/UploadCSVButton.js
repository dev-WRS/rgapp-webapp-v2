import { useState } from 'react'

import InputFile from 'components/core/InputFile'
import Button from 'components/core/Button'

import { Icon } from 'styles'

import csvParser from '../../csv-parser.js'

const UploadCSVButton = ({
	id,
	name,
	options = {},
	onChange
}) => {
	const [open, setOpen] = useState(0)

	const handleOpen = () => setOpen(open + 1)

	const handleChange = async (event) => {
		const cvsFile = event.target.files[0]
		const data = await csvParser(cvsFile, {
			separator: ',',
			secondarySeparator: ';',
			...options
		})

		setOpen(0)
		onChange && onChange(data)
	}

	return (
		<>
			<Button
				variant="contained"
				startIcon={<Icon icon='upload' size={22} color={'white'} />}
				onClick={handleOpen}
				sx={{
					borderRadius: '4px',
					backgroundColor: '#646c68',
					marginRight: .5,
					marginLeft: .5,
					stroke: 'white',
					strokeWidth: '15px',
					opacity: '0.7'
				}}
			>Upload data from CSV file</Button>	
			<InputFile
				id={id}
				name={name}
				open={open}
				accept="text/csv"
				hidden
				onChange={handleChange}
			/>
		</>
	)
}

export default UploadCSVButton