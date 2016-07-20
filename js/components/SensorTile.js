import React from 'react';
import Actions from '../actions/Action'

/* Sensor Tile */
var SensorTile = React.createClass({
	displayName: "SensorTile",
	handleClick: function(e) {
		Actions.selectSensor(e.currentTarget.id);
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

export default SensorTile
