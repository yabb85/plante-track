import React from 'react';

/* Sensor Tile */
var SensorTile = React.createClass({
	displayName: "SensorTile",
	contextTypes: {
		router: React.PropTypes.object
	},
	handleClick: function(e) {
		const path = '/graph/' + e.currentTarget.id
		this.context.router.push(path)
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
