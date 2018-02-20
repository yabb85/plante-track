export function setName(name) {
	return {
		type: 'SET_NAME',
		name: name
	}
}

export function setMac(mac) {
	return {
		type: 'SET_MAC',
		mac: mac
	}
}

export function setType(plant_type) {
	return {
		type: 'SET_TYPE',
		plant_type: plant_type
	}
}

export function setDescription(description) {
	return {
		type: 'SET_DESCRIPTION',
		description: description
	}
}

export function setSensorList(sensors) {
	return {
		type: 'SET_SENSOR_LIST',
		sensors: sensors
	}
}

export function getSensorData(data) {
	return {
		type: 'GET_SENSOR_DATA',
		sensor: data
	}
}
