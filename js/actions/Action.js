import Dispatcher from '../dispatchers/Dispatcher';
import Constants from '../constants/Constants';

var Actions = {
    loadGraph: function(new_canvas) {
        Dispatcher.handleGraphAction({
            actionType: Constants.LOAD_GRAPH,
			canvas: new_canvas
        });
    },

    updateGraph: function() {
        Dispatcher.handleGraphAction({
            actionType: Constants.UPDATE_GRAPH
        });
    },

	selectSensor: function(newSensor) {
		Dispatcher.handleGraphAction({
			actionType: Constants.SELECT_SENSOR,
			sensor: newSensor
		});
	},

	backSensor: function() {
		Dispatcher.handleGraphAction({
			actionType: Constants.BACK_SENSOR
		});
	},

	loadSensorList: function() {
		Dispatcher.handleGraphAction({
			actionType: Constants.LOAD_SENSOR_LIST
		});
	}

};

module.exports = Actions;
