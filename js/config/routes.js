import App from '../components/App'
import SensorList from '../components/SensorList'
import SensorGraph from '../components/SensorGraph'
import SensorForm from '../components/SensorForm'
import SensorEdit from '../components/SensorEdit'

const routes = {
	components: App,
	childRoutes: [
		{
			path: '/',
			component: SensorList
		},
		{
			path: '/graph/:mac',
			component: SensorGraph
		},
		{
			path: '/add_sensor',
			component: SensorForm
		},
		{
			path: '/edit_sensor/:mac',
			component: SensorEdit
		}
	]
}

export default routes;
