import React from 'react'
import Dropzone from 'react-dropzone'
import { connect } from 'react-redux'
import * as actions from '../redux/action'


class SensorEdit extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			name: props.name,
			mac: props.mac,
			plant_type: props.plant_type,
			description: props.description,
			file: null,
			image: ''
		}
		this._onSetName = this._onSetName.bind(this)
		this._onSetMac = this._onSetMac.bind(this)
		this._onSetType = this._onSetType.bind(this)
		this._onSetDescription = this._onSetDescription.bind(this)
		this._onDrop = this._onDrop.bind(this)
		this._onSubmit = this._onSubmit.bind(this)
	}

	componentWillMount() {
	}

	componentDidMount() {
		this.props.loadSensorData(this.props.match.params.mac)
	}

	componentWillUnmount() {
	}

	componentWillReceiveProps(nextProps) {
		let newState = this.state
		newState.name = nextProps.name
		newState.mac = nextProps.mac
		newState.plant_type = nextProps.plant_type
		newState.description = nextProps.description
		newState.file = null
		newState.image = nextProps.image
		this.setState(newState)
	}

	render() {
		if (this.state.file != null) {
			var style = {
				backgroundImage: 'url(' + this.state.file.preview + ')',
				backgroundRepeat: 'no-repeat',
				backgroundSize: 'contain',
				height: '200px'
			}
		} else {
			var style = {
				backgroundImage: 'url(' + this.state.image + ')',
				backgroundRepeat: 'no-repeat',
				backgroundSize: 'contain',
				height: '200px'
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
						<input type='text' value={this.state.plant_type} onChange={this._onSetType}/>
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
	}

	_onSetName(event) {
		let newState = this.state
		newState.name = event.target.value
		this.setState(newState)
	}

	_onSetMac(event) {
		let newState = this.state
		newState.mac = event.target.value
		this.setState(newState)
	}

	_onSetType(event) {
		let newState = this.state
		newState.plant_type = event.target.value
		this.setState(newState)
	}

	_onSetDescription(event) {
		let newState = this.state
		newState.description = event.target.value
		this.setState(newState)
	}

	_onDrop(files) {
		let newState = this.state
		newState.file = files[0]
		this.setState(newState)
	}

	_onSubmit(event) {
		event.preventDefault()
		var myHeaders = new Headers()
		//myHeaders.append('Content-Type', 'application/json')
		var formData = new FormData()
		formData.append('name', this.state.name)
		formData.append('mac', this.state.mac)
		formData.append('plant_type', this.state.plant_type)
		formData.append('description', this.state.description)
		formData.append('file', this.state.file)
		fetch('/sensors/' + this.props.match.params.mac, {
			method: 'PUT',
			body: formData,
			headers: myHeaders
		})
		.then(function(response) {
			return response.json()
		})
		.then(async function(data) {
			console.log(data)
		})
		return false
	}
}

export default connect(
	function mapStateToProps(state) {
		return {
			name: state.sensor.get('name'),
			description: state.sensor.get('description'),
			plant_type: state.sensor.get('plant_type'),
			mac: state.sensor.get('mac'),
			image: state.sensor.get('image'),
		}
	},
	function mapDispatchToProps(dispatch) {
		return {
			loadSensorData: (mac) => {
				fetch("/sensors/" + mac)
					.then(function(response) {
						return response.json()
					})
					.then(async function(data) {
						dispatch(actions.getSensorData(data))
					});
			},
			cleanSensorData: () => {
				dispatch(actions.getSensorData(null))
			}
		}

	}
)(SensorEdit)
