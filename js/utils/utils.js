export function parseSensor(data) {
	let labels = []
	let temps = []
	let humidity = []
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
			var unix_time = new Date(element.date);
			var date = unix_time.getDate()+"/"+(unix_time.getMonth()+1)+"/"+unix_time.getFullYear()
			date += " "+unix_time.getHours()+":"+unix_time.getMinutes()+":"+unix_time.getSeconds()
			labels.push(date)
			temps.push(parseInt(element.temperature))
			humidity.push(parseInt(element.humidity))
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
		humidity: humidity
	}
}
