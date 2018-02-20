import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers } from 'redux'
import { Provider } from 'react-redux'
import App from './components/App';

import profil_reduc from './redux/profil_reduc'
import sensors_list_reduc from './redux/sensor_list_reduc'
import sensor_reduc from './redux/sensor_reduc'

const reducers = {
	profil: profil_reduc,
	sensors_list: sensors_list_reduc,
	sensor: sensor_reduc
}

const reduc = combineReducers(reducers)
const store = createStore(
	reduc,
	window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>,
	document.getElementById("body")
);
