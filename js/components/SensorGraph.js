import React from 'react';
import Actions from '../actions/Action'
import Store from '../stores/Store'

function getGraphState() {
	return Store.getCurrentGraph();
}

/* Graph */
var SensorGraph = React.createClass({
	displayName: "SensorGraph",
	getInitialState: function() {
		return getGraphState();
	},
	componentWillMount: function() {
		Store.removeChangeListener(this._onChange);
	},
    componentDidMount: function() {
		Store.addChangeListener(this._onChange);
		let chartCanvas = this.refs.chart;
		this._onInit(chartCanvas);
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
				<button onClick={this._onBack}>Back</button>
				<button onClick={this._onUpdate}>Reload</button>
            </div>
        );
    },
	_onUpdate: function() {
		Actions.updateGraph();
	},
	_onInit: function(canvas) {
		Actions.loadGraph(canvas);
	},
	_onBack: function() {
		Store.removeChangeListener(this._onChange);
		Actions.backSensor();
	},
	_onChange: function() {
		this.setState(getGraphState());
	}
});

export default SensorGraph
