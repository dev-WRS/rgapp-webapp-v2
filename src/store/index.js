import { createStore, applyMiddleware, compose } from 'redux'
import { thunk, logger } from './middlewares'

import reducers from './reducers'

export const createStoreInitialState = (initialState) => createStore(
	reducers,
	initialState,
	compose(
		applyMiddleware(
			thunk, // lets us dispatch() functions
			logger // neat middleware that logs actions
		)
	)	
)