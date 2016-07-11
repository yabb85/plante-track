import React from 'react';
import SensorList from './SensorList'
import SensorGraph from './SensorGraph'
import $ from 'jquery';

function parse_sensor(data) {
	var sensors = [];
	let labels = {};
	let temps = {};
	let humidity = {};
	let idx = 0
		for (let sensor in data) {
			sensors.push(sensor);
			labels[sensor] = []
				temps[sensor] = []
				humidity[sensor] = []
				for (let element of data[sensor]) {
					var unix_time = new Date(element.date*1000);
					var date = unix_time.getDate()+"/"+(unix_time.getMonth()+1)+"/"+unix_time.getFullYear();
					date += " "+unix_time.getHours()+":"+unix_time.getMinutes()+":"+unix_time.getSeconds();
					labels[sensor].push(date);
					temps[sensor].push(parseInt(element.temp));
					humidity[sensor].push(parseInt(element.humidity));

				}
		}
	return {
		sensors: sensors,
		labels: labels,
		temps: temps,
		humidity: humidity
	}
}


/* Application */
var App = React.createClass({
	displayName: "Application",
	getInitialState: function() {
		/* initialize component */
		return {
			sensors: [],
			sensor: "test",
			state:"list"
		};
	},
	componentDidMount: function() {
		this.serverRequest = $.get("/sensors", function(data) {
			var result = parse_sensor(data);
			this.setState({
				sensors: result.sensors,
				sensor: this.state.sensor,
				state:"list"
			});
		}.bind(this));
	},
	componentWillUnmount: function() {
		this.serverRequest.abort();
	},
	selectSensor: function(sensor) {
		this.setState({
			sensors: this.state.sensors,
			sensor: sensor,
			state: "graph"
		});
	},
	back: function() {
		this.setState({
			sensors: this.state.sensors,
			sensor: this.state.sensor,
			state: "list"
		});
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
	}
});

export default App
