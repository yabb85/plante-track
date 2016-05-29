result = []

var SensorItem = React.createClass({
	displayName: "SensorItem",
	render: function() {
		var root = React.createElement('li', null, "test");
		return(root);
	}
});
var SensorItemFactory = React.createFactory(SensorItem);


var SensorList = React.createClass({
	displayName: "SensorList",
	render: function() {
		var root = React.createElement('ul', null, SensorItemFactory());
		return(root);
	}
});
var SensorListFactory = React.createFactory(SensorList);

var SensorGraph = React.createClass({
	displayName: "SensorGraph",
	render: function() {
		var root = React.createElement('div', {id: 'graph'});
		return(root);
	}
});
var SensorGraphFactory = React.createFactory(SensorGraph);

var App = React.createClass({
	displayName: "Application",
	render: function() {
		var root = React.createElement('div', null, SensorListFactory(), SensorGraphFactory());
		return(root);
	}
});
var AppFactory = React.createFactory(App);
ReactDOM.render(AppFactory(), document.getElementById("container"));


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
	$('#graph').highcharts({
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


