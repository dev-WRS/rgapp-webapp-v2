import { createTheme } from '@mui/material/styles'

const init = () => {
	return createTheme({
		palette: {
			primary: {
				main: '#2B2B2B'
			},
			secondary: {
				main: '#88AC3E'
			},
			text: {
				primary: '#000000',
				terciary: '#4D565C',
				light: '#5D6561',
			},
			brand: {
				dark: '#1F1F1F',
				beige: '#B2A048',
				lightbeige: '#A3A3A3',
				gray: '#A6AFB6',
				orange: '#FC7A57',
				customer: '#93B7BE',
				certifier: '#BFACC8',
				project: '#88AC3E',
			},
			report: {
				inProgress: '#B5446E',
				readyForReview: '#FC7A57',
				approved: '#88AC3E',
				closed: '#7EA3CC'
			},
			cancel: {
				main: '#A3A3A3',
				contrastText: '#A3A3A3',
			}
		}
	})
}

export default init