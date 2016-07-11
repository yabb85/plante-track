import React from 'react';
import $ from 'jquery';
import Chart from 'chart.js';

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

/* Graph */
var SensorGraph = React.createClass({
	displayName: "SensorGraph",
	getInitialState: function() {
		return {
			chart: null,
			label: [],
			humidity: [],
			temp: []
		};
	},
	reload: function() {
		let url = "/sensors/"+this.props.name;
		this.serverRequest = $.get(url, function(data) {
			let result = parse_sensor(data);
			let chartCanvas = this.refs.chart;
			this.setState({
				chart: this.state.chart,
				label: result.labels[this.props.name],
				temp: result.temps[this.props.name],
				humidity: result.humidity[this.props.name]
			});
		}.bind(this));
	},
    componentDidMount: function() {
		let chartCanvas = this.refs.chart;
		let myChart = new Chart(chartCanvas, {
			type: 'line',
			data: {
				labels: this.state.label,
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
					data: this.state.humidity
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
					data: this.state.temp
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

		this.setState({
			chart: myChart,
			label: this.state.label,
			humidity: this.state.humidity,
			temp: this.state.temp
		});
		this.reload();
    },
	componentDidUpdate: function () {
		let chart = this.state.chart;
		chart.data.datasets[0].data = this.state.humidity;
		chart.data.datasets[1].data = this.state.temp;
		chart.data.labels = this.state.label;
		chart.update();
	},
    render: function() {
        return (
            <div>
                <canvas ref={'chart'} height="100" width="600"></canvas>
				<button onClick={this.props.action}>Back</button>
				<button onClick={this.reload}>Reload</button>
            </div>
        );
    }
});

export default SensorGraph
