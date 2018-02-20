import React from 'react';
import { Redirect } from 'react-router-dom'

/* Sensor Tile */
class SensorTile extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			redirect: false,
			id: ''
		}
	}

	render() {
		const style = {
			backgroundImage: 'url(' + this.props.image + ')'
		};
		if (this.state.redirect) {
			return(<Redirect push to={"/board/" + this.state.id}/>)
		} else {
			return(
				<div className="col-xs-4 col-sm-3 col-lg-2" key={this.props.name} id={this.props.mac} onClick={() => this.handleClick()}>
					<div className="thumbnail" style={style}>
 						{this.props.name}
					</div>
				</div>
			)
		}
	}

	handleClick() {
		this.setState({
			redirect: true,
			id: this.props.mac
		})
	}
}

export default SensorTile
