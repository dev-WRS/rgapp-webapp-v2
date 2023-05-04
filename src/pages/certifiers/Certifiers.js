import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import checkPermission from 'check-permission'

import CertifierList from 'components/CertifierList'

import AddCertifier from './AddCertifier'
import EditCertifier from './EditCertifier'
import DeleteCertifier from './DeleteCertifier'

import { fetchCertifiers } from 'actions'
import { MSG_TYPE } from 'constants'

const Certifiers = () => {
	const dispatch = useDispatch()
	const permissions = useSelector(state => state.permissions && state.permissions.data)
	const certifiers = useSelector(state => state.certifiers && state.certifiers.data)
	const [isLoading, setLoading] = useState(false)
	const actions = useMemo(() => [
		{ key: 'add-certifiers', label: 'Add', icon: 'plus', element: AddCertifier },
		{ key: 'edit-certifiers', label: 'Edit', icon: 'pencil', element: EditCertifier, disabled: (selection) => (selection.length !== 1), default: true },
		{ key: 'delete-certifiers', label: 'Delete', icon: 'trash-can', element: DeleteCertifier, disabled: (selection) => (selection.length === 0) }
	], [])

	useEffect(() => {
		setLoading(true)
		dispatch(fetchCertifiers()).then(() => {
			setTimeout(() => setLoading(false), 2000)
		}).catch(() => setLoading(false))
	}, [dispatch])

	const handleRefresh = () => {
		setLoading(true)
		dispatch(fetchCertifiers()).then(() => {
			setTimeout(() => setLoading(false), 2000)
		}).catch(() => setLoading(false))
	}
	const handleActionClose = (action, result) => {		
		if (result && result.type !== MSG_TYPE.error) {
			setLoading(true)
			dispatch(fetchCertifiers()).then(() => {
				setTimeout(() => setLoading(false), 2000)
			}).catch(() => setLoading(false))
		}
	}

	return (
		<CertifierList
			actions={actions.filter(item => 
				checkPermission(item, permissions))}
			certifiers={certifiers}
			defaultAction={actions.find(item => item.default)}
			onRefresh={handleRefresh}
			onActionClose={handleActionClose}
			isLoading={isLoading}
		/>
	)
}

export default Certifiers