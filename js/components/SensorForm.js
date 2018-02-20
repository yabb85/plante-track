import React from 'react'
import Dropzone from 'react-dropzone'
import { connect } from 'react-redux'
import * as actions from '../redux/action'
import { Redirect } from 'react-router-dom'


class SensorForm extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			created: false,
			message: ''
		}
		this._onSubmit = this._onSubmit.bind(this)
	}

	componentWillMount() {
	}

	componentDidMount() {
	}

	componentWillUnmount() {
	}

	render() {
		if (this.state.created) {
			return(<Redirect push to="/"/>)
		} else {
			return (
				<div>
					<h1>Ajouter un capteur</h1>
					<div>
						{this.state.message}
					</div>
					<form onSubmit={this._onSubmit}>
						<div>
							<label>Nom du capteur</label>
							<input type='text' value={this.props.sensor.get('name')} onChange={this.props.setName}/>
						</div>
						<div>
							<label>Adresse MAC</label>
							<input type='text' value={this.props.sensor.get('mac')} onChange={this.props.setMac}/>
						</div>
						<div>
							<label>Type de plante</label>
							<input type='text' value={this.props.sensor.get('plant_type')} onChange={this.props.setType}/>
						</div>
						<div>
							<label>Description</label>
							<textarea value={this.props.sensor.get('description')} onChange={this.props.setDescription}/>
						</div>
						<div>
							<label>Image</label>
							<Dropzone ref='dropzone' onDrop={this._onDrop} multiple={false}>
								<div>Try dropping some files here, or click to select files to upload.</div>
							</Dropzone>
							{this.props.files.length > 0 ? <div>
							<h2>Uploading {this.props.files.length} files...</h2>
							<div>{this.props.files.map((file) => <img src={file.preview} /> )}</div>
							</div> : null}
						</div>
						<input type='submit' />
					</form>
				</div>
			)
		}
	}

	_onDrop(files) {
	}

	_onSubmit(e) {
		e.preventDefault()
		//this.props.setSensor(JSON.stringify(this.props.sensor))
		var myHeaders = new Headers()
		myHeaders.append('Content-Type', 'application/json')
		var data = new FormData()
		data.append('json', this.props.sensor)
		fetch("/sensors", {
			method: 'POST',
			body: JSON.stringify(this.props.sensor),
			headers: myHeaders
		})
			.then(function(response) {
				return response.json()
			})
			.then(async function(data) {
				console.log(typeof data)
				console.log(data)
				if (data.hasOwnProperty('message')) {
					this.setState({
						created: false,
						message: data.message
					})
				} else {
					this.setState({
						created: true,
						message: ''
					})
				}
			}.bind(this));
	}

}

export default connect(
	function mapStateToProps(state) {
		return {
			sensor: state.sensor,
			files: []
		}
	},
	function mapDispatchToProps(dispatch) {
		return {
			setName: (name) => {
				dispatch(actions.setName(name.target.value))
			},
			setMac: (mac) => {
				dispatch(actions.setMac(mac.target.value))
			},
			setType: (type) => {
				dispatch(actions.setType(type.target.value))
			},
			setDescription: (description) => {
				dispatch(actions.setDescription(description.target.value))
			},
			setSensor: (sensor) => {
			}
		}
	}
)(SensorForm)
