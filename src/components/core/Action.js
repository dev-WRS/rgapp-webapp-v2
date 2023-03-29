import PropTypes from 'prop-types'

const Action = ({ element: Element, ...props }) => {
	return Element && (
		<Element {...props}/>
	) 
}

Action.propTypes = {
	onClose: PropTypes.func.isRequired
}

export default Action