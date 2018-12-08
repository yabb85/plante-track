import React from 'react';
import { Route, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircle } from '@fortawesome/free-solid-svg-icons'
import { faSun } from '@fortawesome/free-solid-svg-icons'
import { faThermometerHalf } from '@fortawesome/free-solid-svg-icons'
import { faTint } from '@fortawesome/free-solid-svg-icons'
import SensorGraph from './SensorGraph.js'

class IconLink extends React.Component {
	constructor(props) {
		super(props)
	}

	render() {
		return(
			<Route
				path={this.props.to}
				exact={this.props.activeOnlyWhenExact}
				children={({match}) => (
					<Link to={this.props.to}>
						<div className={match ? "icon active" : "icon"}>
							<FontAwesomeIcon icon={this.props.icon} transform="down-2.2" style={{ color: this.props.color }}/>
						</div>
					</Link>
				)}
			/>
		)
	}
}

class SensorMeasure extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
		}
		this.displayGraph = this.displayGraph.bind(this)
	}

	render() {
		return(
			<div className="row">
				<div className="col-md-1 col-xs-12">
					<IconLink to={`${this.props.match.url}/floor_humidity`} activeOnlyWhenExact={true} icon={faTint} color="#10e8a7"/>
					<IconLink to={`${this.props.match.url}/humidity`} activeOnlyWhenExact={true} icon={faSun} color="#ff9063"/>
					<IconLink to={`${this.props.match.url}/temperature`} activeOnlyWhenExact={true} icon={faThermometerHalf} color="#10e8a7"/>
				</div>
				<div className="col-md-11">
					<Route path={`${this.props.match.path}/:measure`} component={(props) => this.displayGraph(props)}/>
				</div>
			</div>
		)
	}

	displayGraph(props) {
		if(props.match.params.measure == 'floor_humidity') {
			return(
				<SensorGraph label='Humidité au sol' labels={this.props.date} data={this.props.floor_humidity} backgroundColor='rgba(16, 232, 167, 0.4)' borderColor='rgba(16, 232, 167, 1)' />
			)
		} else if(props.match.params.measure == 'humidity') {
			return(
				<SensorGraph label='' labels={this.props.date} data={this.props.humidity} backgroundColor='rgba(54, 162, 235, 0.4)' borderColor='rgba(54, 162, 235, 1)' />
			)
		} else if(props.match.params.measure == 'temperature') {
			return(
				<SensorGraph label='Température' labels={this.props.date} data={this.props.temperature} backgroundColor='rgba(255, 99, 132, 0.4)' borderColor='rgba(255, 99, 132, 1)' />
			)
		}
	}
}

export default SensorMeasure
