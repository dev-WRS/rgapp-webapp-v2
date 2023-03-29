const fs = require('fs')

// const types = ['A-LO', 'B-LO', 'C-LO']
const qualifyingCategories = ['HVAC', 'Lighting', 'Envelop']
const methods = ['Permanent', 'Interim Whole Building', 'Interim Space-by-Space']
const types = [
	'Convention Center',
	'Court House',
	'Dining: Bar Lounge/Leisure',
	'Automotive Facility',
	'Dining: Cafeteria/Fast Food',
	'Dining: Family',
	'Dormitory',
	'Exercise Center',
	'Hotel',
	'Library',
	'Gymnasium',
	'Motion Picture Theatre',
	'Hospital/Healthcare',
	'Manufacturing Facility',
	'Motel',
	'Museum',
	'Office'
]

const generateNumber = (min, max) => {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min
}

const generateString = (length = 8) => {
    var result           = ''
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
    var charactersLength = characters.length
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength))
   }
   return result
}

//building
//'name', 'type', 'address', 'qualifyingCategories', 'area', 'rate', 'method', 'totalWatts', 'percentReduction', 'savingsRequirement'

//dwelling unit
// 'address', 'certificateNumber', 'type', 'model', 'building', 'unit'

const generateBuildings = () => {
	const items = []
	const address = (n) => `${n} 238th Ln SE`
	const defaults = {}

	for (let i = 0, ln = 200; i < ln; i++) {
		items.push({
			...defaults,
			name: generateString(),
			type: types[generateNumber(0, types.length - 1)],
			address: address(generateNumber(65000, 68000)),
			qualifyingCategories: qualifyingCategories.slice(generateNumber(0, qualifyingCategories.length - 1)),
			area: generateNumber(1000, 3000),
			rate: generateNumber(100, 500),
			method: methods[generateNumber(0, methods.length - 1)],
			totalWatts: generateNumber(1000, 5000),
			percentReduction: generateNumber(20, 90)
		})
	}

	return items
}

const unitTypes = ['A-LO', 'B-LO', 'C-LO']
const models = ['House', 'Apartment', 'Rowhouse', 'Townhouse', 'Duplex']

const generateDwellings = () => {
	const items = []
	const address = (n) => `${n} 238th Ln NE`
	const defaults = {}

	for (let i = 0, ln = 30; i < ln; i++) {
		items.push({
			...defaults,
			address: address(generateNumber(65000, 68000)),
			certificateNumber: generateNumber(1000, 3000),
			type: unitTypes[generateNumber(0, unitTypes.length - 1)],
			model: models[generateNumber(0, models.length - 1)],
			building: String.fromCharCode(generateNumber(65, 90)),
			unit: generateNumber(100, 110)
		})
	}

	return items
}

const array2csv = (items, options = {}) => {
	const { separator, secondarySeparator } = options
	const line = value => `${value}\n`
	const sep = separator || ','
	let csv = line(`sep=${sep}`)

	if (items && items.length > 0) {
		const headers = Object.keys(items[0])
		const secondarySep = sep === ',' ? ' ' : secondarySeparator

		csv += line(`${headers.join(sep)}`)

		items.forEach(item => {
			const values = Object.values(item)
				.map(value => Array.isArray(value) ? `"${value.join(secondarySep)}"` : value)

			csv += line(`${values.join(sep)}`)
		})
	}

	return csv
}

const buildings = generateBuildings()

fs.writeFileSync('buildings.csv', array2csv(buildings, {
	separator: ';',
	secondarySeparator: ','
}))

const dwellings = generateDwellings()

fs.writeFileSync('dwellings.csv', array2csv(dwellings, {
	separator: ';',
	secondarySeparator: ','
}))