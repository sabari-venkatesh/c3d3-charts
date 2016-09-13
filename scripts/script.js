(function() {

	/* Data to be fed initially */
	var rawData = {
		"KYC_status": {
			"inprogress":"204, 170",
			"clean": "103",
			"str": "260,340,10",
			"whitelist": "150",
			"falsepossitive": "65,5"
		}
	};

	/* returns the array of statuses & their total */
	var cleanData = getformattedData( rawData );

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
			columns: cleanData.payload,
			type : 'donut',
			onclick: function(d, i) { console.log("onclick", d, i); },
			onmouseover: function(d, i) { console.log("onmouseover", d, i); },
			onmouseout: function(d, i) { console.log("onmouseout", d, i); }
		},
		donut: {
			title: "Total: " + cleanData.total, /* Total here */
			label: {
				format: function( val, ratio, id ) {
	//						return Math.round(ratio * 100) + "%"; // to return percentage
					return val;
				}
			}
		},
		legend: {
			item: {
				onclick: function(id) {

				}
			}
		},
		tooltip: {
			format: {
				title: function(d) {
					return 'Workflows';
				},
				value: function(val, ratio, id) {
					return rawData.KYC_status[id];
				}
			}
		},
		color: {
			pattern: ['#7F1637', '#047878', '#FFB733', '#F57336', '#C22121']
		}
	});

	/* Dynamically loads data after a timeout */
	setTimeout(function () {
		rawData = {
			"KYC_status": {
				inprogress: [20, 10],
				clean: [10],
				str:[20,30,10],
				whitelist:[10],
				falsepossitive:[5,5]
			}
		};
		cleanData = getformattedData( rawData );
		chart.load({
			columns: cleanData.payload,
			done: function() {
				// To update the total when the data changes
				d3.select(".chart_graphic .c3-chart-arcs-title").node().innerHTML = "Total: " + cleanData.total;
			}
		});
	}, 2500);

})();

/* getformattedData
 * @param: rawData
 * @return: data with the status payload and total
*/
function getformattedData( rawData ) {
	var kyc = rawData.KYC_status, data = {}, grandTotal = 0, numArr, dataArray = [];
	for (var status in kyc) {
		if ( kyc.hasOwnProperty( status ) ) {
			if ( typeof( kyc[status]) !== "object" ) {
				numArr = kyc[status].split(',')
			} else {
				numArr = kyc[status];
			}
			var subTotal = parseInt(numArr.reduce(function(total, num) {
				return parseInt(total) + parseInt(num);
			}));
			var arr = [status, subTotal];
			dataArray.push(arr);
			grandTotal += subTotal;
		}
	}
	data.payload = dataArray;
	data.total = grandTotal;
	return data;
}
