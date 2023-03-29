const config = {
	issuer: 'Walker Reid Strategies, Inc.',
	staticPath: {
		alias: '/build',
		path: ['src', 'build']
	},
	apiKey: '87a5cfa3.40057b3ec212c3e8f5c8145f0086cf38',
	session: {
		name: 'd8ad0ec86885af269b168fa8c14c0eed',
		secret: '1f7e10baf0e44ab23be3320ad8935b276c51ef753fac12306cbc093bebbbcfe866d6f6d4d6c0dd6f4bc02792ecc93da474fd9bbb38e6cad69590099314c78ac4',
		cookieMaxAge: 8 * 60 * 60 * 1000, //8h
		ttl: 8 * 60 * 60 //8h
	},
	smtp: {
		sender: '"Loopthy Corp." <dev@loopthy.com>'
	}
}
export default config