import Dispatcher from '../dispatchers/Dispatcher';
import EventEmitter from 'events';
import Constants from '../constants/Constants';
import Chart from 'chart.js';
import $ from 'jquery';

var CHANGE_EVENT = 'change';

var _graph_data = {
	chart: null,
	label: [],
	humidity: [],
	temp: []
};

var _sensorList = {
	sensor: '',
	sensors: [],
	state: 'list'
};

/*
 * Met en forme les donnée de la liste des capteurs retourné par le serveur
 */
function parseSensor(data) {
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

/*
 * Creer un Graph a l'aide de CharJS
 */
function loadGraph(chartCanvas, name) {
	let myChart = new Chart(chartCanvas, {
		type: 'line',
		data: {
			labels: _graph_data.label,
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
				data: _graph_data.humidity
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
				data: _graph_data.temp
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
	_graph_data.chart = myChart;
	let url = "/sensors/"+name;
    return $.get(url, function(data) {
		let result = parseSensor(data);
		_graph_data.label = result.labels[name];
		_graph_data.temp = result.temps[name];
		_graph_data.humidity = result.humidity[name];
        Store.emitChange();
    });
}

/*
 * Remet a jour les donnés du graph
 */
function updateGraph(name) {
	let url = "/sensors/"+name;
    return $.get(url, function(data) {
		let result = parseSensor(data);
		_graph_data.label = result.labels[name];
		_graph_data.temp = result.temps[name];
		_graph_data.humidity = result.humidity[name];
        Store.emitChange();
    });
}

/*
 * Permet de revenir a la vue liste
 * remet a jour le type de vue dans le store sensorList
 */
function backSensor() {
	_sensorList.state = 'list';
}

function loadSensorList() {
	let url = "/sensors";
    return $.get(url, function(data) {
		let result = parseSensor(data);
		_sensorList.sensors = result.sensors;
		_sensorList.state = 'list';
        Store.emitChange();
    });

}

var Store = Object.assign({}, EventEmitter.prototype, {

    getCurrentGraph: function() {
        return _graph_data;
    },

	getSensorList: function() {
		return _sensorList;
	},

    emitChange: function() {
        this.emit(CHANGE_EVENT);
    },

    addChangeListener: function(callback) {
        this.on(CHANGE_EVENT, callback);
    },

    removeChangeListener: function(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    }
});

Dispatcher.register(function(payload) {

    switch(payload.action.actionType) {
        case Constants.UPDATE_GRAPH:
            updateGraph(payload.action.name);
            break;

        case Constants.LOAD_GRAPH:
            loadGraph(payload.action.canvas, payload.action.name);
            break;

		case Constants.BACK_SENSOR:
			backSensor();
			break;

		case Constants.LOAD_SENSOR_LIST:
			loadSensorList(payload.action.name);
			break;

        default:
            return true;
    }

    Store.emitChange();

    return true;
});

module.exports = Store;
