result = []

$.get( "sensors", function( data ) {
	var series = [];
	var xAxis = [];
	for (sensor in data) {
		var temperature = [];
		var humidity = [];
		for (let elem of data[sensor]) {
			var unix_time = new Date(elem.date*1000);
			var date = unix_time.getDate()+"/"+unix_time.getMonth()+"/"+unix_time.getFullYear();
			date += " "+unix_time.getHours()+":"+unix_time.getMinutes()+":"+unix_time.getSeconds();
			xAxis.push(date);
			temperature.push(parseInt(elem.temp));
			humidity.push(parseInt(elem.humidity));
		}
		series.push({name:"temp", data:temperature});
		series.push({name: "humidity", data: humidity});
	}
	display(series, xAxis);
});


function display(series, xAxis) {
	$('#container').highcharts({
		chart: {
			type: 'spline'
		},
		title: {
			text: 'Temperature & Humidité'
		},
		xAxis: {
			categories: xAxis
		},
		yAxis: {
			title: {
				text: 'Temperature'
			}
		},
		series: series
	});
}


