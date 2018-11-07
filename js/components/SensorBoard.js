import React from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import * as actions from '../redux/action'
import SensorGraph from './SensorGraph.js'

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
					<div className="col-md-5">
						<span>{this.props.name}</span>
						<img src={this.props.image} />
					</div>
					<div className="col-md-6">
						<div className="row">
							<div className="col-md-7">
								<span>{this.props.plant_type}</span>
							</div>
							<div className="col-md-7">
								<span>{this.props.description}</span>
							</div>
						</div>
					</div>
					<div className="col-md-1">
						<Link to={'/edit_sensor/' + this.props.match.params.mac }>
							edit <span className='glyphicon glyphicon-pencil'/>
						</Link>
					</div>
				</div>
				<div className="row">
					<SensorGraph label='Température' labels={this.props.date} data={this.props.temperature} backgroundColor='rgba(255, 99, 132, 0.4)' borderColor='rgba(255, 99, 132, 1)' />
					<SensorGraph label='Humidité' labels={this.props.date} data={this.props.humidity} backgroundColor='rgba(54, 162, 235, 0.4)' borderColor='rgba(54, 162, 235, 1)' />
					<SensorGraph label='Humidité au sol' labels={this.props.date} data={this.props.floor_humidity} backgroundColor='rgba(75, 192, 192, 0.4)' borderColor='rgba(75, 192, 192, 1)' />
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
