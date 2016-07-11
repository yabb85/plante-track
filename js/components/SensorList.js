import React from 'react';
import SensorTile from './SensorTile'

/* Sensor List */
var SensorList = React.createClass({
	displayName: "SensorList",
	render: function() {
		var createItem = function(callback) {
			return function(item) {
				return(
					<SensorTile key={item} onClick={callback}>{item}</SensorTile>
				);
			};
		};
		return(
			<div className="row">
				{this.props.items.map(createItem(this.props.listSubmit))}
			</div>
		);
	}
});

export default SensorList
