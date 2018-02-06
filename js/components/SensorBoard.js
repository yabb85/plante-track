import React from 'react';
import Actions from '../actions/Action'
import Store from '../stores/Store'
import { Link } from 'react-router'

function getGraphState() {
	return Store.getCurrentGraph();
}

/* Graph */
var SensorBoard = React.createClass({
	displayName: "SensorBoard",
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
	componentWillUnmount: function() {
		Store.removeChangeListener(this._onChange);
	},
    render: function() {
        return (
            <div>
				<div className="row">
					<div className="col-md-5">
						<span>{this.state.name}</span>
					</div>
					<div className="col-md-6">
						<div className="row">
							<div className="col-md-7">
								<span>{this.state.type}</span>
							</div>
							<div className="col-md-7">
								<span>{this.state.description}</span>
							</div>
						</div>
					</div>
					<div className="col-md-1">
						<Link to={'/edit_sensor/' + this.props.params.mac }>
							edit <span className='glyphicon glyphicon-pencil'/>
						</Link>
					</div>
				</div>
				<div className="row">
					<canvas ref={'chart'}></canvas>
					<button onClick={this._onBack}>Back</button>
					<button onClick={this._onUpdate}>Reload</button>
				</div>
            </div>
        );
    },
	contextTypes: {
		router: React.PropTypes.object
	},
	_onUpdate: function() {
		Actions.updateGraph(this.props.params.mac);
	},
	_onInit: function(canvas) {
		Actions.loadGraph(canvas, this.props.params.mac);
	},
	_onBack: function() {
		Store.removeChangeListener(this._onChange);
		this.context.router.push('/')
	},
	_onChange: function() {
		this.setState(getGraphState());
	}
});

export default SensorBoard
