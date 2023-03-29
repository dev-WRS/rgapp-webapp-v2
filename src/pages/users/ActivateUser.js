/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { activateUser } from 'actions'
import { MSG_TYPE } from 'constants'

const ActivateUser = ({
	selection, 
	onClose	
}) => {
	const dispatch = useDispatch()
	
	useEffect(() => {
		const activate = async () => {
			const { error } = await dispatch(activateUser(selection[0].id))
			
			if (error) {
				onClose({
					type: MSG_TYPE.error,
					message: error.message
				})
			}
			else {
				onClose({
					type: MSG_TYPE.success,
					message: 'The user has been successfully activated'
				})
			}
		}
		
		activate()
	}, [dispatch, selection])
}

export default ActivateUser