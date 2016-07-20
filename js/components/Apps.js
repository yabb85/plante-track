import React from 'react';
import SensorList from './SensorList'
import SensorGraph from './SensorGraph'
import Store from '../stores/Store'
import Actions from '../actions/Action'
import $ from 'jquery';


function getSensorListState() {
	return Store.getCurrentSensor();
}

/* Application */
var App = React.createClass({
	displayName: "Application",
	getInitialState: function() {
		/* initialize component */
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
		this.serverRequest.abort();
	},
	render: function() {
		/* render function */
		if (this.state.state == "list") {
			return(
				<div>
					<SensorList listSubmit={this.selectSensor} items={this.state.sensors}/>
				</div>
				  );
		} else {
			return(
				<div>
					<SensorGraph
						name={this.state.sensor}
						action={this.back}/>
					</div>
				  );
		}
	},
	_onInit: function() {
		Actions.loadSensorList();
	},
	_onChange: function() {
		this.setState(getSensorListState());
	}
});

export default App
