import Dispatcher from '../dispatchers/Dispatcher';
import Constants from '../constants/Constants';

var Actions = {
    loadGraph: function(new_canvas, name) {
        Dispatcher.handleGraphAction({
            actionType: Constants.LOAD_GRAPH,
			canvas: new_canvas,
			name: name
        });
    },

    updateGraph: function(name) {
        Dispatcher.handleGraphAction({
            actionType: Constants.UPDATE_GRAPH,
			name: name
        });
    },

	backSensor: function() {
		Dispatcher.handleGraphAction({
			actionType: Constants.BACK_SENSOR
		});
	},

	loadSensorList: function(name) {
		Dispatcher.handleGraphAction({
			actionType: Constants.LOAD_SENSOR_LIST
		});
	}

};

module.exports = Actions;
