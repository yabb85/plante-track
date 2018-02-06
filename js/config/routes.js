import App from '../components/App'
import SensorList from '../components/SensorList'
import SensorBoard from '../components/SensorBoard'
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
			component: SensorBoard
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
