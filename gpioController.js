try {
	var GPIO = require('onoff').Gpio;
} catch (err){
	console.log('GPIO WON\'T WORK HERE');

	// mock GPIO
	var GPIO = function(){
		this.writeSync = this.unexport = this.watch = () => 1;
	}
}

var openPins = {};

process.on('SIGINT', () => {
	for (var pinID in openPins){
		var pin = openPins[pinID];
		pin.writeSync(0);
		pin.unexport();
		console.log('Closed pin ' + pinID);
	};
});

var open = (pins, dir, edge) => {
	pins.forEach(pin => {
		if (openPins[pin]){
			throw 'Pin ' + pin + ' is already in use.';
		}
		openPins[pin] = new GPIO(pin, dir, edge);
		console.log('Opened pin ' + pin);
	});
};

module.exports = {
	init: (inputs, outputs) => {
		open(inputs, 'in', 'both');
		open(outputs, 'out');
	},
	pinOnDuration(pin, millis){
		var pump = openPins[pin];

		if (!pump){
			throw 'Pin ' + pin + ' not found.';
		}

		pump.writeSync(1);
		console.log('Turning on pin ' + pin + ' for ' + millis + 'ms');
		setTimeout(() => {
			pump.writeSync(0);
			console.log('Turning off pin ' + pin);
		}, millis);
	},
	onPress(pin, callback){
		var button = openPins[pin];

		if (!button){
			throw 'Pin ' + button + ' not found.';
		}

		button.watch((err, value) => {
			if (err) throw err;
			if (!value) callback();
		});
	}
};
