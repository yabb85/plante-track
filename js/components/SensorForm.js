import React from 'react'
import Dropzone from 'react-dropzone'
import EventEmitter from 'events'
import $ from 'jquery';

/*
 * Create a separate component
 */
var CHANGE_EVENT = 'change_create_sensor'
// local storage
var _form_data = {
	files: [],
	name: '',
	mac: '',
	type: '',
	description: ''
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
		this.on(CHANGE_EVENT, callback);
	},

	removeChangeListener: function(callback) {
		this.removeListener(CHANGE_EVENT, callback)
	}
});

// functions
function setImage(files) {
	_form_data.files = files
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

function createSensor() {
	var form_data = new FormData()
	$.each(_form_data, function(key, value) {
		form_data.append(key, value)
	})
	console.log(form_data)
	let url = '/sensors'
	return $.ajax({
		url: url,
		type: 'POST',
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

var SensorForm = React.createClass({
	displayName: 'UploadImage',
	getInitialState: function() {
		return Store.getFormData()
	},
	componentWillMount: function() {
		Store.removeChangeListener(this._onChange)
	},
	componentDidMount: function() {
		Store.addChangeListener(this._onChange)
	},
	componentWillUnmount: function() {
		Store.removeChangeListener(this._onChange)
	},
	render: function() {
		return (
			<div>
				<h1>Ajouter un capteur</h1>
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
							<div>Try dropping some files here, or click to select files to upload.</div>
						</Dropzone>
						{this.state.files.length > 0 ? <div>
						<h2>Uploading {this.state.files.length} files...</h2>
						<div>{this.state.files.map((file) => <img src={file.preview} /> )}</div>
						</div> : null}
					</div>
					<input type='submit' />
				</form>
			</div>
		)
	},
	_onDrop: function(files) {
		setImage(files)
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
	_onSubmit: function(e) {
		e.preventDefault()
		createSensor()
	},
	_onChange: function() {
		this.setState(Store.getFormData());
	}
})

export default SensorForm
