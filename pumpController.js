var GPIO = require('onoff').Gpio;
var openPins = {};

process.on('SIGINT', () => {
	for (var pinID in openPins){
		var pin = openPins[pinID];
		pin.writeSync(0);
		pin.unexport();
		console.log('Closed pin ' + pinID);
	};
});

module.exports = {
	init: pins => {
		pins.forEach(pin => {
			if (openPins[pin]){
				throw 'Pin ' + pin + ' is already in use.';
			}
			openPins[pin] = new GPIO(pin, 'out');
			console.log('Opened pin ' + pin);
		});
	},
	runPump(pin, millis){
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
	}
};
