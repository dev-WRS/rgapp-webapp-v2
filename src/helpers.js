import moment from 'moment'

export const dateFormat = (date, format) => moment(date).format(format)

export const sizeFormat = (bytes, decimals = 2) => {
	const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

	if (bytes === 0) return `0 ${sizes[0]}`

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

export const hexid = (length = 8) => Math.random().toString(16).substring(2, length + 2)