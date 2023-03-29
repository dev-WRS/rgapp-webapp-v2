const readFile = (file) => new Promise((resolve) => {
	if (file && FileReader) {
		const fileReader = new FileReader()

		fileReader.onload = (event) => {
			const csvOutput = event.target.result
			resolve(csvOutput)
		}

		fileReader.readAsText(file)
	}
	else {
		resolve()
	}
})

const parser = async (file, options = {}) => {
	const separatorName = 'sep='
	const { validate, separator, secondarySeparator  } = options
	const result = []
	let sep = separator || ','
	
	const content = await readFile(file)
	const lines = content.split('\n')
	let ln = lines.length
	let index = 0

	if (ln > 0) {
		let headers

		if (lines[index] && lines[index].startsWith(separatorName)) {
			sep = lines[index].split(separatorName)[1].replace(/(\r\n|\n|\r)/gm, '')
			index++
		}
		
		const secondarySep = secondarySeparator || ( sep === ',' ? ';' : ',')

		if (lines[index]) {
			headers = lines[index].replace(/(\r\n|\n|\r)/gm, '').split(sep)
			index++
		}

		if (headers && headers.length > 0) {
			for(;index < ln; index++) {
				if (lines[index] !== '') {
					const values = lines[index].split(sep)
					const item = headers.reduce((item, name, i) => {
						if (values[i] && values[i].startsWith('"') && values[i].endsWith('"')) {
							const sanitized = JSON.parse(values[i])
							item[name] = sanitized.split(secondarySep)
						}
						else {
							item[name] = values[i]
						}
						return item
					}, {})

					if (!validate || (validate && validate(item))) {
						result.push(item)
					}
					else {
						throw new Error('Invalid format: CSV file has invalid data item')
					}
				}
			}
		}
		else {
			throw new Error('Invalid format: CSV file should have column names')
		}
	}
	return result
}

export default parser