import MongoStore from 'connect-mongo'

const init = async ({ config }) => {
	if (config.db && config.db.mongoose) {
		return MongoStore.create({ 
			mongoUrl: config.db.mongoose.uri 
		})
	}
	return null
}

export default init