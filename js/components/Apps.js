import React from 'react';
import { Router, Route, browserHistory, IndexRoute } from 'react-router'
import SensorList from './SensorList'
import SensorGraph from './SensorGraph'


/* Application */
var App = React.createClass({
	displayName: "Application",
	render: function() {
		/* render function */
		return(
			<Router history={browserHistory}>
				<Route path='/' component={SensorList}/>
				<Route path='/graph/:name' component={SensorGraph}/>
			</Router>
		);
	}
});

export default App
