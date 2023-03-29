import createApp, { start } from 'lts-server'

const name = 'WR.ReportGen'

start(createApp())
	.then(app => console.log(`${name} SSR listening on port ${app.get('port')}`))
	.catch(error => console.error(`${name} SSR ${error.message}`, error))