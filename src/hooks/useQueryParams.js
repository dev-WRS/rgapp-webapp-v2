import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'

const useQueryParams = () => {
	const { search } = useLocation()
	const params = useMemo(() => new URLSearchParams(search), [search])
	return Object.fromEntries(params)
}

export default useQueryParams