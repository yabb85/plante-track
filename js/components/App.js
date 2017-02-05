import React from 'react';
import { IndexLink, Link } from 'react-router'
import SensorList from './SensorList'
import SensorGraph from './SensorGraph'
import SensorForm from './SensorForm'
import SensorEdit from './SensorEdit'


var App = React.createClass({
	displayName: "Application",
	getInitialState() {
		return {
		}
	},
	render: function() {
		return(
				<div>
					<nav className="navbar navbar-inverse navbar-fixed-top" role="navigation">
						<div className="container">
							<div className="navbar-header">
								<button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
									<span className="sr-only">Toggle navigation</span>
									<span className="icon-bar"></span>
									<span className="icon-bar"></span>
									<span className="icon-bar"></span>
								</button>
								<IndexLink to="/" className="navbar-brand">Ueki</IndexLink>
							</div>
							<div id="navbar" className="navbar-collapse collapse">
								<ul className="nav navbar-nav navbar-right">
									<li>
										<Link to="/sensors">Liste</Link>
									</li>
									<li>
										<Link to="/add_sensor">Ajouter catpeur</Link>
									</li>
								</ul>
							</div>
						</div>
					</nav>
					<div className="container">
						<div className="starter-template">
							{this.props.children}
						</div>
					</div>
				</div>
			  );
	}
});

export default App
