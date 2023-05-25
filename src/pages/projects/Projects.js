import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import checkPermission from 'check-permission'

import ProjectList from 'components/ProjectList'

import AddProject from './AddProject'
import CopyProject from './CopyProjects'
import EditProject from './EditProject'
import DeleteProject from './DeleteProject'
import ChangeStatusProject from './ChangeStatusProject'
import GenerateReportProject from './GenerateReportProject'
import DownloadReportProject from './DownloadReportProject'
import OpenReportProject from './OpenReportProject'

import { fetchProjects } from 'actions'
import { MSG_TYPE } from 'constants'

const Projects = () => {
	const dispatch = useDispatch()
	const auth = useSelector(state => state.auth && state.auth.data)
	const permissions = useSelector(state => state.permissions && state.permissions.data)
	const projects = useSelector(state => state.projects && state.projects.data)
	const [isLoading, setLoading] = useState(false)
	const actions = useMemo(() => [
		{ key: 'add-projects', label: 'Add', icon: 'plus', element: AddProject },
		{ key: 'copy-projects', label: 'Copy', icon: 'copy', element: CopyProject, disabled: (selection) => (selection.length === 0) },
		{ key: 'edit-projects', label: 'Edit', icon: 'pencil', element: EditProject, disabled: (selection) => (selection.length !== 1 || selection[0].status === 'approved' || selection[0].status === 'closed'), default: true },
		{ key: 'change-status-projects', label: 'Change Status', icon: 'swap', element: ChangeStatusProject, disabled: (selection) => (selection.length !== 1) || (selection[0].status !== 'inProgress' && auth.role.name === 'Staff'), default: true },
		{ key: 'delete-projects', label: 'Delete', icon: 'trash-can', element: DeleteProject, disabled: (selection) => (selection.length === 0) },
		{ key: 'generate-reports', separator: true, label: 'Generate Report', icon: 'page', element: GenerateReportProject, disabled: (selection) => (selection.length === 0) },
		{ key: 'open-reports', label: 'Open Report', icon: 'top-right-arrow-box', element: OpenReportProject, disabled: (selection) => (selection.length !== 1 || (selection.length === 1 && !selection[0].report)) },
		{ key: 'download-reports', label: 'Download Report', icon: 'download', element: DownloadReportProject, disabled: (selection) => (selection.length !== 1 || (selection.length === 1 && !selection[0].report)) },
		{ key: 'print-reports', label: 'Print Report', icon: 'printer', element: DeleteProject, disabled: (selection) => (selection.length === 0) }
	], [auth.role.name])

	useEffect(() => {
		setLoading(true) 
		dispatch(fetchProjects()).then(() => {
			setTimeout(() => setLoading(false), 2000)
		}).catch(() => setLoading(false))
	}, [dispatch])

	const handleRefresh = () => {
		setLoading(true) 
		dispatch(fetchProjects()).then(() => {
			setTimeout(() => setLoading(false), 2000)
		}).catch(() => setLoading(false))
	}
	const handleActionClose = (action, result) => {
		if (result && result.type !== MSG_TYPE.error) {
			setLoading(true)
			dispatch(fetchProjects()).then(() => {
				setTimeout(() => setLoading(false), 2000)
			}).catch(() => setLoading(false))
		}
	}

	return (
		<ProjectList
			actions={actions.filter(item =>
				checkPermission(item, permissions))}
			projects={projects}
			defaultAction={actions.find(item => item.default)}
			onRefresh={handleRefresh}
			onActionClose={handleActionClose}
			isLoading={isLoading}
		/>
	)
}

export default Projects