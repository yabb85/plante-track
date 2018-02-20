import Immutable, { List, Map } from 'immutable'

export const sensors_list = List([])

export const profil = Map({
	name: ''
})

export const sensor = Map({
	name: '',
	mac: '',
	plant_type: '',
	description: '',
	image: '',
	file: '',
	temperature: List(),
	humidity: List(),
	floor_humidity: List(),
	date: List()
})
