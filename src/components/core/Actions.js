const Actions = ({ current, children }) => {
	return (current) ? children.find(action => (action.props.name === current.key)) : null
}

export default Actions