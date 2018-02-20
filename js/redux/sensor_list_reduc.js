import { sensors_list } from './fixtures.js'
import Immutable, { Map, List } from 'immutable'

export default function sensors_list_reduc(state = sensors_list, action) {
	switch(action.type) {
		case 'SET_SENSOR_LIST':
			var newState = List()
			for (const sensor_name in action.sensors) {
				let temp = Map({
					name: sensor_name,
					mac: action.sensors[sensor_name].mac,
					id: action.sensors[sensor_name].id,
					image: action.sensors[sensor_name].image
				})
				newState = newState.push(temp)
			}
			return newState
		default:
			return state
	}
}
