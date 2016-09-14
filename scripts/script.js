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
			}
		}
	};

	var cleanData = getformattedData( rawData, true );

	/* Init chart */
	var chart = c3.generate({
		bindto: '.chart_graphic',
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
		}
	});

})();

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
