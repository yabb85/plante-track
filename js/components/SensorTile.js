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
		const style = {
			backgroundImage: 'url(' + this.props.children.image + ')'
		};
		return(
				<div className="col-xs-4 col-sm-3 col-lg-2" key={this.props.children.name} id={this.props.children.mac} onClick={this.handleClick}>
					<div className="thumbnail" style={style}>
 						{this.props.children.name}
					</div>
				</div>
			  );
	}
});

export default SensorTile
