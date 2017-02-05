import React from 'react'
import Dropzone from 'react-dropzone'
import EventEmitter from 'events'
import $ from 'jquery';
import { parseSensor } from '../utils/utils.js'

var CHANGE_EVENT = 'change_create_sensor'
// local storage
var _form_data = {
	file: null,
	name: '',
	mac: '',
	type: '',
	description: '',
	image: ''
}

//local store
var Store = Object.assign({}, EventEmitter.prototype, {
	getFormData: function() {
		return _form_data
	},

	emitChange: function() {
		this.emit(CHANGE_EVENT)
	},

	addChangeListener: function(callback) {
		this.on(CHANGE_EVENT, callback)
	},

	removeChangeListener: function(callback) {
		this.removeListener(CHANGE_EVENT, callback)
	}
})


function loadData(address) {
	let url = '/sensors/' + address
	return $.ajax({
		url: url,
		type: 'GET',
		success: function(data) {
			data = parseSensor(data)
			_form_data.type = data.type
			_form_data.mac = data.mac
			_form_data.name = data.name
			_form_data.description = data.description
			_form_data.image = data.image
			Store.emitChange()
		}
	})
}

function setImage(files) {
	_form_data.file = files[0]
	Store.emitChange()
}

function setName(name) {
	_form_data.name = name
	Store.emitChange()
}

function setMac(address) {
	_form_data.mac = address
	Store.emitChange()
}

function setType(type) {
	_form_data.type = type
	Store.emitChange()
}

function setDescription(description) {
	_form_data.description = description
	Store.emitChange()
}

function updateSensor(data) {
	var form_data = new FormData()
	$.each(data, function(key, value) {
		form_data.append(key, value)
	})
	let url = '/sensors/' + data.mac
	return $.ajax({
		url: url,
		type: 'PUT',
		cache: false,
		data: form_data,
		dataType: 'json',
		processData: false,
		contentType: false,
		success: function(data) {
			console.log(data)
		}
	})
}

var SensorEdit = React.createClass({
	displayName: 'SensorEdit',
	getInitialState: function() {
		return Store.getFormData()
	},
	componentWillMount: function() {
		Store.removeChangeListener(this._onChange)
	},
	componentDidMount: function() {
		Store.addChangeListener(this._onChange)
		this._onInit(this.props.params.mac)
	},
	componentWillUnmount: function() {
		Store.removeChangeListener(this._onChange)
	},
	render: function() {
		if (this.state.file != null) {
			var style = {
				backgroundImage: 'url(' + this.state.file.preview + ')'
			}
		} else {
			var style = {
				backgroundImage: 'url(' + this.state.image + ')'
			}
		}
		return (
			<div>
				<h1>Modification du capteur</h1>
				<form onSubmit={this._onSubmit}>
					<div>
						<label>Nom du capteur</label>
						<input type='text' value={this.state.name} onChange={this._onSetName}/>
					</div>
					<div>
						<label>Adresse MAC</label>
						<input type='text' value={this.state.mac} onChange={this._onSetMac}/>
					</div>
					<div>
						<label>Type de plante</label>
						<input type='text' value={this.state.type} onChange={this._onSetType}/>
					</div>
					<div>
						<label>Description</label>
						<textarea value={this.state.description} onChange={this._onSetDescription}/>
					</div>
					<div>
						<label>Image</label>
						<Dropzone ref='dropzone' onDrop={this._onDrop} multiple={false}>
							<div style= {style}>Try dropping some files here, or click to select files to upload.</div>
						</Dropzone>
					</div>
					<input type='submit' />
				</form>
			</div>
		)
	},
	_onChange: function() {
		this.setState(Store.getFormData())
	},
	_onInit: function(address) {
		loadData(address)
	},
	_onSetName: function(event) {
		setName(event.target.value)
	},
	_onSetMac: function(event) {
		setMac(event.target.value)
	},
	_onSetType: function(event) {
		setType(event.target.value)
	},
	_onSetDescription: function(event) {
		setDescription(event.target.value)
	},
	_onSubmit: function() {
		updateSensor(_form_data)
	},
	_onDrop: function(files) {
		setImage(files)
	}
})

export default SensorEdit
