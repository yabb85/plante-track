import React from 'react';
import { Link } from 'react-router-dom'
import { BrowserRouter, Route } from 'react-router-dom';
import SensorList from './SensorList'
import SensorBoard from './SensorBoard'
import SensorForm from './SensorForm'


class App extends React.Component {
	render() {
		return(
			<BrowserRouter>
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
								<Link to="/"><span className="navbar-brand">Ueki</span></Link>
							</div>
							<div id="navbar" className="navbar-collapse collapse">
								<ul className="nav navbar-nav navbar-right">
									<li>
										<Link to="/add_sensor">Ajouter un capteur</Link>
									</li>
									<li>
										toto
									</li>
								</ul>
							</div>
						</div>
					</nav>
					<div className="container">
						<div className="starter-template">
							<Route exact path='/' component={SensorList} />
							<Route path='/board/:mac' component={SensorBoard} />
							<Route path="/add_sensor" component={SensorForm}/>
						</div>
					</div>
				</div>
			</BrowserRouter>
		);
	}
}

export default App
