// call in our drink controller and initialize it
var drinkController = require('./drinkController')();

// call in express and initialize it as "app"
var express = require('express');
var app = express();

// send CORS headers so the browser will allow communication with the server from anywhere
app.use(require('cors')());

app.get('/', (req, res) => {
	res.sendFile('ui.html', {root: __dirname});
});

// serve config. To separate concerns and keep things DRY, only drinkController accesses config.json directly
app.get('/config', (req, res) => {
	res.send(drinkController.getConfig());
});

// endpoint for requesting a drink. Drink requests are added to a queue inside drinkController
app.post('/request/:drinkID', (req, res) => {
	try {
		var msg = drinkController.queueDrink(req.params.drinkID);
		console.log(msg);
		res.send(msg);
	} catch (error) {
		console.error(error);
		res.status(500).send(error);
	}
});

// start server on port 3000
app.listen(3000, () => {
	console.log('Started on port 3000');
});
