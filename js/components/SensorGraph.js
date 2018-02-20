import React from 'react'
import { Line } from 'react-chartjs-2'

class SensorGraph extends React.Component {
	constructor(props) {
		super(props)
		this.options = {
			responsive: true,
			maintainAspectRatio: false,
			scales: {
				yAxes: [{
					display: true,
					ticks: {
						steps: 10,
						stepValue: 5
					},
				}],
				xAxes: [{
					type: 'time',
					time: {
						parser: 'YYYY-MM-DDTHH:mm',
						tooltipFormat: 'll HH:mm',
						displayFormats: {
							hour: 'MMM DD HH:mm'
						}
					},
					scaleLabel: {
						display: true,
						labelString: 'Date'
					}
				}]
			},
			elements: {
				line: {
					fill: false
				}
			}
		}
		this._updateData(props)
	}

	componentWillReceiveProps(nextProps) {
		this._updateData(nextProps)
	}

	render() {
		return (
			<Line data={this.data} options={this.options} />
		)
	}

	_updateData(measures) {
		this.data = {
			labels: measures.labels,
			datasets: [
				{
					label: this.props.label,
					fill: false,
					lineTension: 0.3,
					backgroundColor: this.props.backgroundColor,
					borderColor: this.props.borderColor,
					borderWidth: 2,
					pointBorderWidth: 1,
					pointHoverRadius: 10,
					pointHoverBorderWidth: 2,
					pointRadius: 1,
					pointHitRadius: 10,
					data: measures.data
				}
			]
		}
	}
}

export default SensorGraph
