import React from 'react';
import { Router, Route, hashHistory, IndexRoute } from 'react-router'
import SensorList from './SensorList'
import SensorGraph from './SensorGraph'
import SensorForm from './SensorForm'


/* Application */
var App = React.createClass({
	displayName: "Application",
	render: function() {
		/* render function */
		return(
			/* use router to display list or graph */
			<Router history={hashHistory}>
				<Route path='/' component={SensorList}/>
				<Route path='/graph/:mac' component={SensorGraph}/>
				<Route path='/add_sensor' component={SensorForm}/>
			</Router>
		);
	}
});

export default App
