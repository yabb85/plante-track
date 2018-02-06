import moment from 'moment'
import 'moment-timezone'

export function parseSensor(data) {
	let labels = []
	let temps = []
	let humidity = []
	let floor_humidity = []
	let type = ''
	let description = ''
	let name = ''
	let mac = ''
	let image = ''
	for (let sensor in data) {
		name = sensor
		type = data[sensor]['type']
		description = data[sensor]['description']
		mac = data[sensor]['mac']
		image = data[sensor]['image']
		for (let element of data[sensor]['stats']) {
			let date = moment.utc(element.date)
			let zone = moment.tz.guess()
			let offset = moment.tz(zone).format("Z")
			date.utcOffset(offset)
			labels.push(date)
			temps.push(parseInt(element.temperature))
			humidity.push(parseInt(element.humidity))
			floor_humidity.push(parseInt(element.floor_humidity))
		}
	}
	return {
		name: name,
		type: type,
		mac: mac,
		description: description,
		labels: labels,
		image: image,
		temps: temps,
		humidity: humidity,
		floor_humidity: floor_humidity
	}
}
