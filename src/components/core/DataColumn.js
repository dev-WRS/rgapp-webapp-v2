import Tooltip from '@mui/material/Tooltip'
import Chip from '@mui/material/Chip'

import PhoneLink from 'components/core/PhoneLink'

const ChipColumn = ({ label, ...others }) => {
    return (
		<Tooltip title={label}>
			<Chip label={label} 
				{...others}  
			/>
		</Tooltip>
    )
}

const PhoneColumn = ({ href, ...others }) => {
    return (
		<PhoneLink href={href} {...others}>{href}</PhoneLink>
	)
}

const DataColumn = {
	Chip: ChipColumn,
	Phone: PhoneColumn
}

export default DataColumn