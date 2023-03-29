import React, { useEffect } from 'react'
import * as ReactDOM from 'react-dom/client'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import { CacheProvider } from '@emotion/react'
import { Provider as StateProvider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'

import App from 'App'
import createTheme from 'theme'
import createEmotionCache from 'emotion-cache'
import reportWebVitals from 'report-webvitals'
import appSpec from 'app-spec.json'
import { createStoreInitialState } from 'store'

const cache = createEmotionCache()

const preloadedState = window.__PRELOADED_STATE__
delete window.__PRELOADED_STATE__
const store = createStoreInitialState(preloadedState)

const Main = () => {
	const theme = createTheme()

	useEffect(() => {
		const jsInitials = document.getElementById('js-initials')
		if (jsInitials && jsInitials.parentNode) {
			jsInitials.parentNode.removeChild(jsInitials)
		}
	})

	return (
		<CacheProvider value={cache}>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<StateProvider store={store}>
					<BrowserRouter>
						<App appSpec={appSpec} />
					</BrowserRouter>
				</StateProvider>
			</ThemeProvider>
		</CacheProvider>
	)
}

ReactDOM.hydrateRoot(document.querySelector('#root'), <Main />)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()