import React from 'react';
import SensorTile from './SensorTile'
import Actions from '../actions/Action'
import Store from '../stores/Store'

function getSensorListState() {
	return Store.getSensorList();
}

/* Sensor List */
var SensorList = React.createClass({
	displayName: "SensorList",
	getInitialState: function() {
		return getSensorListState();
	},
	componentWillMount: function() {
		Store.removeChangeListener(this._onChange);
	},
	componentDidMount: function() {
		Store.addChangeListener(this._onChange);
		this._onInit();
	},
	componentWillUnmount: function() {
		Store.removeChangeListener(this._onChange);
	},
	render: function() {
		var createItem = function(item) {
			return(
				<SensorTile key={item}>{item}</SensorTile>
			);
		};
		return(
			<div className="row">
				{this.state.sensors.map(createItem)}
			</div>
		);
	},
	_onInit: function() {
		Actions.loadSensorList();
	},
	_onChange: function() {
		this.setState(getSensorListState());
	}
});

export default SensorList
