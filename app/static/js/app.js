graph = {
	type: 'line',
	data: {
		labels: [],
		datasets:[{
			label: 'Humidité',
			fill: false,
			lineTension: 0.3,
			borderWidth: 2,
			pointBorderWidth: 1,
			pointHoverRadius: 10,
			pointHoverBorderWidth: 1,
			pointRadius: 4,
			pointHitRadius: 10,
			backgroundColor: "rgba(54, 162, 235, 0.4)",
			borderColor: "#36A2EB",
			data: [],
		},
		{
			label: 'Température',
			fill: false,
			lineTension: 0.3,
			borderWidth: 2,
			pointBorderWidth: 1,
			pointHoverRadius: 10,
			pointHoverBorderWidth: 2,
			pointRadius: 4,
			pointHitRadius: 10,
			backgroundColor: "rgba(255, 99, 132, 0.4)",
			borderColor: "#FF6384",
			data: []
			//data: [65, 59, 80, 81, 56, 55, 40]
		}]
	},
	options: {
		scales: {
			yAxes: [{
				display: true,
				ticks: {
					steps: 10,
					stepValue: 5
				},
			}],
			xAxes: [{
				display: true,
				gridLines: {
					display: false
				}
			}]
		},
		elements: {
			line: {
				fill: false
			}
		}
	}
};

var ctx = document.getElementById("myChart");
var myChart = new Chart(ctx, graph);

$.get( "sensors", function( data ) {
	var tab = data["test"];
	var labels = [];
	var hum = [];
	var temp = [];
	for (let elem of tab) {
		var unix_time = new Date(elem.date*1000);
		var date =  unix_time.getDate()+"/"+unix_time.getMonth()+"/"+unix_time.getFullYear();
			date += " "+unix_time.getHours()+":"+unix_time.getMinutes()+":"+unix_time.getSeconds();
		labels.push(date);
		hum.push(parseInt(elem.humidity));
		temp.push(parseInt(elem.temp));
	}

	myChart.data.labels = labels;
	myChart.data.datasets[0].data = hum;
	myChart.data.datasets[1].data = temp;
	myChart.update();
});



