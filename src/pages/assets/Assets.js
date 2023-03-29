import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import checkPermission from 'check-permission'

import AssetList from 'components/AssetList'

import AddAsset from './AddAsset'
import DownloadAsset from './DownloadAsset'
import OpenAsset from './OpenAsset'
import DeleteAsset from './DeleteAsset'

import { fetchAssets } from 'actions'
import { MSG_TYPE } from 'constants'

const Assets = () => {
	const dispatch = useDispatch()
	const permissions = useSelector(state => state.permissions && state.permissions.data)
	const assets = useSelector(state => state.assets && state.assets.data)
	const actions = useMemo(() => [
		{ key: 'upload-assets', label: 'Upload', icon: 'upload', element: AddAsset },
		{ key: 'download-assets', label: 'Download', icon: 'download', element: DownloadAsset, disabled: (selection) => (selection.length !== 1) },
		{ key: 'open-assets', label: 'Open', icon: 'top-right-arrow-box', element: OpenAsset, disabled: (selection) => (selection.length !== 1), default: true },
		{ key: 'delete-assets', label: 'Delete', icon: 'trash-can', element: DeleteAsset, disabled: (selection) => (selection.length === 0) },
	], [])

	useEffect(() => {
		dispatch(fetchAssets())
	}, [dispatch])

	const handleRefresh = () => dispatch(fetchAssets())
	const handleActionClose = (action, result) => {
		if (result && result.type !== MSG_TYPE.error) {
			dispatch(fetchAssets())
		}
	}

	return (
		<AssetList
			actions={actions.filter(item => 
				checkPermission(item, permissions))}
			assets={assets}
			defaultAction={actions.find(item => item.default)}
			onRefresh={handleRefresh}
			onActionClose={handleActionClose}
		/>
	)
}

export default Assets