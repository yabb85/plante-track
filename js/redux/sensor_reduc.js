import { sensor } from './fixtures.js'
import Immutable, { Map, List } from 'immutable'
import moment from 'moment'
import 'moment-timezone'

export default function sensor_reduc(state = sensor, action) {
	switch(action.type) {
		case 'SET_NAME':
			return state.set('name', action.name)
		case 'SET_MAC':
			return state.set('mac', action.mac)
		case 'SET_TYPE':
			return state.set('plant_type', action.plant_type)
		case 'SET_DESCRIPTION':
			return state.set('description', action.description)
		case 'GET_SENSOR_DATA':
			var newState = sensor
			if (action.sensor != null) {
				newState = newState.set('name', action.sensor.name)
				newState = newState.set('mac', action.sensor.mac)
				newState = newState.set('plant_type', action.sensor.plant_type)
				newState = newState.set('description', action.sensor.description)
				newState = newState.set('image', action.sensor.image)
				var newHumidity = List()
				var newDate = List()
				var newTemperature = List()
				var newFloorHumidity = List()
				if (action.sensor.hasOwnProperty('stats')) {
					for (let stat of action.sensor.stats) {
						let date = moment.utc(stat.date)
						let zone = moment.tz.guess()
						let offset = moment.tz(zone).format("Z")
						date.utcOffset(offset)
						newHumidity = newHumidity.push(stat.humidity)
						newTemperature = newTemperature.push(stat.temperature)
						newFloorHumidity = newFloorHumidity.push(stat.floor_humidity)
						newDate = newDate.push(stat.date)
					}
				}
				newState = newState.set('date', newDate)
				newState = newState.set('temperature', newTemperature)
				newState = newState.set('humidity', newHumidity)
				newState = newState.set('floor_humidity', newFloorHumidity)
			}
			return newState
		default:
			return state
	}
}
