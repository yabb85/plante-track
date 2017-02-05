import Dispatcher from '../dispatchers/Dispatcher';
import EventEmitter from 'events';
import Constants from '../constants/Constants';
import Chart from 'chart.js';
import $ from 'jquery';
import {  parseSensor } from '../utils/utils.js'

var CHANGE_EVENT = 'change';

var _graph_data = {
	name: '',
	chart: null,
	type: '',
	description: '',
	label: [],
	humidity: [],
	temp: []
};

var _sensorList = {
	sensors: [],
};


/*
 * Met en forme la liste des capteurs retourné par le serveur
 */
function parseSensorList(data) {
	var sensors = [];
	for (let sensor in data) {
		let elem = {
			name: sensor,
			type: data[sensor].type,
			description: data[sensor].description,
			mac: data[sensor].mac,
			image: data[sensor].image
		}
		sensors.push(elem);
	}
	return sensors
}

/*
 * Creer un Graph a l'aide de CharJS
 */
function loadGraph(chartCanvas, mac) {
	let myChart = new Chart(chartCanvas, {
		type: 'line',
		data: {
			labels: _graph_data.label,
			datasets:[{
				label: 'Humidité',
				fill: true,
				lineTension: 0.3,
				borderWidth: 2,
				pointBorderWidth: 1,
				pointHoverRadius: 10,
				pointHoverBorderWidth: 2,
				pointRadius: 1,
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
				pointRadius: 1,
				pointHitRadius: 10,
				backgroundColor: "rgba(255, 99, 132, 0.4)",
				borderColor: "#FF6384",
				data: _graph_data.temp
			}]
		},
		options: {
			responsive: true,
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
	let url = "/sensors/"+mac;
    return $.get(url, function(data) {
		let result = parseSensor(data);
		_graph_data.name = result.name
		_graph_data.type = result.type;
		_graph_data.description = result.description;
		_graph_data.label = result.labels;
		_graph_data.temp = result.temps;
		_graph_data.humidity = result.humidity;
        Store.emitChange();
    });
}

/*
 * Remet a jour les donnés du graph
 */
function updateGraph(mac) {
	let url = "/sensors/"+mac;
    return $.get(url, function(data) {
		let result = parseSensor(data);
		_graph_data.label = result.labels;
		_graph_data.temp = result.temps;
		_graph_data.humidity = result.humidity;
        Store.emitChange();
    });
}

/*
 * Lance une requete au serve pour connaitre la liste des capteurs
 */
function loadSensorList() {
	let url = "/sensors";
    return $.get(url, function(data) {
		_sensorList.sensors = parseSensorList(data);
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
            updateGraph(payload.action.mac);
            break;

        case Constants.LOAD_GRAPH:
            loadGraph(payload.action.canvas, payload.action.mac);
            break;

		case Constants.BACK_SENSOR:
			backSensor();
			break;

		case Constants.LOAD_SENSOR_LIST:
			loadSensorList(payload.action.mac);
			break;

        default:
            return true;
    }

    Store.emitChange();

    return true;
});

module.exports = Store;
