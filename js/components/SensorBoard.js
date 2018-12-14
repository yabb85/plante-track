import React from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircle } from '@fortawesome/free-solid-svg-icons'
import { faSun } from '@fortawesome/free-solid-svg-icons'
import { faThermometerHalf } from '@fortawesome/free-solid-svg-icons'
import { faTint } from '@fortawesome/free-solid-svg-icons'
import * as actions from '../redux/action'
import SensorGraph from './SensorGraph.js'
import SensorMeasure from './SensorMeasure.js'

/* Sensor Dashboard */
class SensorBoard extends React.Component {
	constructor(props) {
		super(props)
	}

	componentWillMount() {
		this.props.loadSensorData(this.props.match.params.mac)
	}

	componentWillUnmount() {
		this.props.cleanSensorData()
	}

    render() {
        return (
            <div>
				<div className="row">
					<div className="col">
						<div>
							<Link to={'/edit_sensor/' + this.props.match.params.mac }>
								edit <span className='glyphicon glyphicon-pencil'/>
							</Link>
						</div>
					</div>
				</div>
				<div className="row">
					<div className="col-md-4">
						<div className="title">{this.props.name}</div>
						<img className="logo" src={this.props.image} />
					</div>
					<div className="col-md-4">
						<div className="row">
							<div className="col-md-6">
								<span>{this.props.plant_type}</span>
							</div>
						</div>
						<div className="row">
							<div className="col-md-6">
								<span>{this.props.description}</span>
							</div>
						</div>
					</div>
				</div>
				<SensorMeasure match={this.props.match} date={this.props.date} temperature={this.props.temperature} humidity={this.props.humidity} floor_humidity={this.props.floor_humidity}/>
				<div className="row">
					<button onClick={this._onBack}>Back</button>
					<button onClick={() => {this.props.loadSensorData(this.props.match.params.mac)}}>Reload</button>
				</div>
            </div>
        );
    }
}

export default connect(
	function mapStateToProps(state) {
		return {
			name: state.sensor.get('name'),
			description: state.sensor.get('description'),
			plant_type: state.sensor.get('plant_type'),
			date: state.sensor.get('date').toArray(),
			image: state.sensor.get('image'),
			temperature: state.sensor.get('temperature').toArray(),
			humidity: state.sensor.get('humidity').toArray(),
			floor_humidity: state.sensor.get('floor_humidity').toArray()
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
						console.log(data)
						dispatch(actions.getSensorData(data))
					});
			},
			cleanSensorData: () => {
				dispatch(actions.getSensorData(null))
			}
		}

	}
)(SensorBoard)
