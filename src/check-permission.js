const isValid = (item, permissions) => {
	return (!item.key || 
		(item.key && permissions.findIndex(permission => permission.key === item.key) !== -1))
}

export default isValid