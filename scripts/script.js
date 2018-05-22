(function() {

	/* Data to be fed initially */
	var rawData = {
		"KYC_status": {
			"inprogress": {
				"wf1": 20,
				"wf2": 10,
				"wf5": 10,
				"wf7": 10
			},
			"clean": {
				"wf1": 10
			},
			"whitelist": {
				"wf3": 30,
				"wf5": 25,
				"wf2": 25,
			},
			"str": {
				"wf2": 30,
				"wf5": 15,
				"wf4": 80,
			},
			"falsepositive": {
				"wf1": 18,
				"wf4": 12,
				"wf6": 3,
			}
		}
	};

	var cleanData = getformattedData( rawData, true );

	/* Init donut chart */
	var donutChart = c3.generate({
		bindto: '#chart_donut .chart_graphic',
		padding: {
			top: 10,
			bottom: 10,
			right: 10,
			left: 10
		},
		data: {
			json: cleanData.payload,
			type : 'donut',
		},
		donut: {
			title: "Total: " + cleanData.total, /* Total here */
			label: {
				format: function( val, ratio, id ) {
					return val;
				}
			}
		},
		legend: {
			item: {
				onclick: function(id) {
					donutChart.toggle(id);
					d3.select(".chart_graphic .c3-chart-arcs-title").node().innerHTML = "Total " +  getTotal(donutChart.data.shown());
				}
			}
		},
		tooltip: {
			format: {
				title: function(d) {
					return 'Status';
				},
				value: function(val, ratio, id) {

					var cleanData = getformattedData( rawData, false );
					var workflows = cleanData.payload[id];
					/*var text = "", status = rawData.KYC_status[id];
					for(var workflows = Object.keys(status), i = 0, end = workflows.length; i < end; i++) {
						var workflow = workflows[i], count = status[workflow];

						text += workflow + ": " + count + (i == (workflows.length - 1) ? "": ", ");
					}*/
					return workflows.join(',');
				}
			}
		},
		color: {
			pattern: ['#7F1637', '#047878', '#FFB733', '#F57336', '#C22121']
		},
		onrendered: function() {

		}
	});

	/* Init bar chart */
	var barChart = c3.generate({
		bindto: '#chart_bar .chart_graphic',
		data: {
			json: {
				"Incomplete": 30,
				"Complete": 100,
				"Approved": 436,
				"Rejected": 1050,
				"Approval Pending": 0,
				"Rejection Pending": 58,
			},
			type: 'bar'
		},
    bar: {
			width: {
					ratio: 0.5
			}
    },
		tooltip: {
			format: {
				title: function(d) {
					return 'Status';
				},
			},
			grouped: false
		},
	})

})();

function getTotal(data) {
	var total = 0;
	for(var i in data) {
		var values = Object.keys(data[i].values).map(function(j) {return data[i].values[j].value});
		total += parseInt(values.reduce(function(t,n) { return t+n; }));
	}

	return total;
}

/* getformattedData
 * @param: rawData
 * @return: data with the status payload and total
*/
function getformattedData( rawData, isGetCount ) {

	var statuses = rawData.KYC_status, payload = {}, data = {total: 0, payload: {}};
	for(var key in statuses) {
		var status = statuses[key];

		if ( isGetCount ) {
			// This creates an array of status count for each workflow
			data.payload[key] = Object.keys(status).map(
				function(workflow) {
					return status[workflow];
				}
			);
			data.total += parseInt(data.payload[key].reduce(function(total, num) { return parseInt(total) + parseInt(num); }));
		} else {
			// This creates an array of workflows for each status
			data.payload[key] = Object.keys(status);
		}
	}
	return data;
}
