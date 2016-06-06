var Chart = require('chart.js');
var React = require('react');
var ReactDOM = require('react-dom');
var $ = require('jquery');


/* Sensor List */
var SensorItem = React.createClass({
	display: "SensorItem",
	handleClick: function(e) {
		console.log(e.target);
		this.props.listSubmit(e.target.id);
	},
	render: function() {
		let item = this.props.item;
		let callback = this.props.callback;
		return(
			<div className="col-xs-4 col-sm-3 col-lg-2"id={item} onClick={this.handleClick}>
				<div className="thumbnail tile tile-medium" id={item}>{item}</div>
			</div>
		);
	}
});

var SensorList = React.createClass({
	displayName: "SensorList",
	render: function() {
		var createItem = function(callback) {
			return function(item) {
				return(
					<SensorItem key={item} item={item} listSubmit={callback}/>
				);
			};
		};
		return(
			<div className="row list">
				{this.props.items.map(createItem(this.props.listSubmit))}
			</div>
		);
	}
});


/* Graph */
var SensorGraph = React.createClass({
	displayName: "SensorGraph",
	getInitialState: function() {
		return {chart: null};
	},
    componentDidMount: function() {
		console.log(this.props.label);
		console.log(this.props.data);
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
	componentDidUpdate () {
		let chart = this.state.chart;
		chart.data.datasets[0].data = this.props.temp;
		chart.data.datasets[1].data = this.props.humidity;
		chart.data.labels = this.props.label;
		chart.update();
	},
    render: function() {
        return (
            <div>
                <canvas ref={'chart'} width="600"></canvas>
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
			sensor: "test", state:"list"};
	},
	componentDidMount: function() {
		this.serverRequest = $.get("/sensors", function(data) {
			var sensors = [];
			let labels = {};
			let temps = {};
			let humidity = {};
			let idx = 0
			for (sensor in data) {
				sensors.push(sensor);
				labels[sensor] = []
				temps[sensor] = []
				humidity[sensor] = []
				for (let element of data[sensor]) {
					var unix_time = new Date(element.date*1000);
					var date = unix_time.getDate()+"/"+unix_time.getMonth()+"/"+unix_time.getFullYear();
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
				state:"list"
			});
		}.bind(this));
	},
	componentWillUnmount: function() {
		this.serverRequest.abort();
	},
	selectSensor: function(sensor) {
		labels = this.state.labels
		temps = this.state.temps
		hums = this.state.hums
		this.setState({
			labels: labels,
			temps: temps,
			hums: hums,
			sensor: sensor,
			state: "graph"});
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
						humidity={this.state.hums[this.state.sensor]}/>
				</div>
				  );
		}
	}
});
ReactDOM.render(<App/>, document.getElementById("container"));
