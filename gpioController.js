// I wanted this code to be runnable on my laptop, so I mock the GPIO api
try {
	var GPIO = require('onoff').Gpio;
} catch (err){
	console.log('GPIO WON\'T WORK HERE');

	// mock GPIO
	var GPIO = function(){
		this.writeSync = this.unexport = this.watch = () => 1;
	}
}

// keep a map of the pins in use. The key is the number, the value is the pin api returned from new GPIO
var openPins = {};

//
process.on('SIGINT', () => {
	for (var pinID in openPins){
		openPins[pinID].unexport();
		console.log('Closed pin ' + pinID);
	};
});

// create pin objects and keep track of them
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

	// turn a pin on for a certain amount of time
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

	// set a function to call when a button is pushed
	onPress(pin, callback){
		var button = openPins[pin];

		if (!button){
			throw 'Pin ' + button + ' not found.';
		}

		button.watch((err, value) => {
			console.log('Button pressed!');
			if (err) console.error(err);

			// for some reason, the value is 0 when the button is pushed. Whatever.
			if (!value) callback();
		});
	}
};
