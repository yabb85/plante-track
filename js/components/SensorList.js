import React from 'react';
import SensorTile from './SensorTile'
import {connect } from 'react-redux'
import * as actions from '../redux/action'


/* Sensor List */
class SensorList extends React.Component {
	constructor(props) {
		super(props)
	}

	componentWillMount() {
		this.props.loadSensorList()
	}

	render() {
		return(
			<div className="row">
				{this.props.sensors.map(item => this.createTile(item))}
			</div>
		);
	}

	createTile(item) {
		return(
			<SensorTile key={item.get('name')} name={item.get('name')} mac={item.get('mac')}></SensorTile>
		);
	};
}

export default connect(
	function mapStateToProps(state) {
		return {sensors: state.sensors_list}
	},
	function mapDispatchToProps(dispatch) {
		return {
			loadSensorList: () => {
				fetch("/sensors")
					.then(function(response) {
						return response.json()
					})
					.then(async function(data) {
						dispatch(actions.setSensorList(data))
					});
			}
		}
	}
)(SensorList)
