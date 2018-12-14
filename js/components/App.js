import React from 'react';
import { Link } from 'react-router-dom'
import { BrowserRouter, Route } from 'react-router-dom';
import SensorList from './SensorList'
import SensorBoard from './SensorBoard'
import SensorForm from './SensorForm'
import SensorEdit from './SensorEdit'


class App extends React.Component {
	render() {
		return(
			<BrowserRouter>
				<div>
					<nav className="navbar navbar-expand-lg navbar-dark bg-dark" role="navigation">
						<Link to="/"><span className="navbar-brand">Ueki</span></Link>
						<div class="navbar-nav ml-auto">
							<Link to="/add_sensor">Ajouter un capteur</Link>
						</div>
					</nav>
					<div className="container">
						<div className="starter-template">
							<Route exact path='/' component={SensorList} />
							<Route path='/board/:mac' component={SensorBoard} />
							<Route path="/add_sensor" component={SensorForm}/>
							<Route path='/edit_sensor/:mac' component={SensorEdit} />
						</div>
					</div>
				</div>
			</BrowserRouter>
		);
	}
}

export default App
