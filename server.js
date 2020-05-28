var five = require("johnny-five");
var moment = require("moment");
var board = new five.Board();

const ns = require ('ns-api') ({
  username: 'w.vangogh@student.fontys.nl',
  password: 'tsONFg3KBtMdzgzXMtwhyvw1wg1vAkoZQitwiMfCcinX_GPDE5439Q'
});

const params = {
  fromStation: 'Eindhoven',
  toStation: '',
	previousAdvices: 0,
	nextAdvices: 2
};

function myCallback (err, data) {
	var trajecten = 3;
	console.log('Aantal trajecten: ', trajecten);
	console.log();
	//return individual items from data array
	for (var i = 0; i < trajecten; i++) {
		console.log("TRAJECT:", i+1);
		console.log("----------")
		console.log('Aantal overstappen: ', data[i].AantalOverstappen);

		for (var j=0; j < data[i].ReisDeel.length; j++) {
			printReisdeel(data[i].ReisDeel[j]);
		}

		console.log("----------")
		console.log("");
	}

	// prints raw unprocesed api data array
	// console.dir (err || data, {
	// 	depth: null,
	// 	colors: true
	// });
}

function printReisdeel(reisdeel) {
	var endStation = reisdeel.ReisStop.pop();
	var departTime = moment(reisdeel.ReisStop[0].Tijd);
	var arrivalTime = moment(endStation.Tijd);
	var travelDuration = arrivalTime.diff(departTime, 'minutes');

	console.log(departTime.format("HH:mm"),'O',reisdeel.ReisStop[0].Naam);
	console.log("","","","","","",'|',"Spoor:",reisdeel.ReisStop[0].Spoor);
	console.log("","","","","","",'|');
	console.log(convertMinsToHrsMins(travelDuration),'|');
	console.log("","","","","","",'|');
	console.log("","","","","","", '|',"Spoor:",endStation.Spoor);
	console.log(arrivalTime.format("HH:mm"),'O',endStation.Naam);
	console.log();
}

function convertMinsToHrsMins(mins) {
  let h = Math.floor(mins / 60);
  let m = mins % 60;
  h = h < 10 ? '0' + h : h;
  m = m < 10 ? '0' + m : m;
  return `${h}:${m}`;
}

board.on("ready", function() {
	var buttons = new five.Buttons({
		pins: [2,4,6,8],
	});

	buttons.on('down', function(button) {
		console.log('Pressed button: ', button.pin);
		switch (button.pin) {
			case 2:
				params.toStation = 'Tilburg';
				break;
			case 4:
				params.toStation = 'Breda';
				break;
			case 6:
				params.toStation = 'Rotterdam';
				break;
			case 8:
				params.toStation = 'Den Bosch';
				break;
		}
		// clears terminal
		console.log('\033[2J');
		// Get travel advice
		ns.reisadvies (params, myCallback);
	});
});
