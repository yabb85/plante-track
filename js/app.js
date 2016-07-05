var Chart = require('chart.js');
var React = require('react');
var ReactDOM = require('react-dom');
var $ = require('jquery');


/* Sensor Tile */
var SensorTile = React.createClass({
	displayName: "SensorTile",
	handleClick: function(e) {
		//console.log(e);
		this.props.onClick(e.currentTarget.id);
	},
	render: function(e) {
		return(
				<div className="col-xs-4 col-sm-3 col-lg-2" key={this.props.children} id={this.props.children} onClick={this.handleClick}>
					<div className="thumbnail">
						{this.props.children}
					</div>
				</div>
			  );
	}
});

/* Sensor List */
var SensorList = React.createClass({
	displayName: "SensorList",
	render: function() {
		var createItem = function(callback) {
			return function(item) {
				return(
					<SensorTile onClick={callback}>{item}</SensorTile>
				);
			};
		};
		return(<div className="row">{this.props.items.map(createItem(this.props.listSubmit))}</div>);
	}
});

var test = [65, 59, 80, 81, 56, 55, 40];

/* Graph */
var SensorGraph = React.createClass({
	displayName: "SensorGraph",
	getInitialState: function() {
		return {chart: null};
	},
    componentDidMount: function() {
		let chartCanvas = this.refs.chart;
		let myChart = new Chart(chartCanvas, {
			type: 'line',
			data: {
				labels: this.props.label,
				datasets:[{
					label: 'Humidité',
					fill: false,
					lineTension: 0.3,
					borderWidth: 2,
					pointBorderWidth: 1,
					pointHoverRadius: 10,
					pointHoverBorderWidth: 2,
					pointRadius: 4,
					pointHitRadius: 10,
					backgroundColor: "rgba(54, 162, 235, 0.4)",
					borderColor: "#36A2EB",
					data: []
				},
				{
					label: 'Température',
					fill: false,
					lineTension: 0.3,
					borderWidth: 2,
					pointBorderWidth: 1,
					pointHoverRadius: 10,
					pointHoverBorderWidth: 2,
					pointRadius: 4,
					pointHitRadius: 10,
					backgroundColor: "rgba(255, 99, 132, 0.4)",
					borderColor: "#FF6384",
					data: []
				}]
			},
			options: {
				scales: {
					yAxes: [{
						display: true,
						ticks: {
							steps: 10,
							stepValue: 5
						},
					}],
					xAxes: [{
						display: true,
						gridLines: {
							display: false
						}
					}]
				},
				elements: {
					line: {
						fill: false
					}
				}
			}
		});

		this.setState({chart: myChart});
    },
	componentDidUpdate: function () {
		let chart = this.state.chart;
		chart.data.datasets[0].data = this.props.humidity;
		chart.data.datasets[1].data = this.props.temp;
		chart.data.labels = this.props.label;
		chart.update();
	},
    render: function() {
        return (
            <div>
                <canvas ref={'chart'} height="100" width="600"></canvas>
				<button onClick={this.props.action}>Back</button>
            </div>
        );
    }
});


/* Application */
var App = React.createClass({
	displayName: "Application",
	getInitialState: function() {
		return {
			sensors: [],
			labels: {},
			temps: {},
			hums: {},
			sensor: "test",
			state:"list"
		};
	},
	componentDidMount: function() {
		this.serverRequest = $.get("/sensors", function(data) {
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
			this.setState({
				sensors: sensors,
				labels: labels,
				temps: temps,
				hums: humidity,
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
			labels: this.state.labels,
			temps: this.state.temps,
			hums: this.state.hums,
			sensor: sensor,
			state: "graph"
		});
	},
	back: function() {
		this.setState({
			sensors: this.state.sensors,
			labels: this.state.labels,
			temps: this.state.temps,
			hums: this.state.hums,
			sensor: this.state.sensor,
			state: "list"
		});
	},
	render: function() {
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
						label={this.state.labels[this.state.sensor]}
						temp={this.state.temps[this.state.sensor]}
						humidity={this.state.hums[this.state.sensor]}
						action={this.back}/>
					</div>
				  );
		}
	}
});
ReactDOM.render(<App/>, document.getElementById("container"));
