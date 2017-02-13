var drinkController = require('./drinkController').init();

var express = require('express');
var app = express();

app.use(require('cors')());
app.use(express.static('public'));

app.get('/config', (req, res) => {
	var config = config;
	res.send(drinkController.getConfig());
});

app.post('/request/:drinkID', (req, res) => {
	try {
		var msg = drinkController.queueDrink(req.params.drinkID);
		console.log(msg);
		res.send(msg);
	} catch (error) {
		console.error(error);
		res.status(500).send(error);
		return;
	}
});

app.listen(3000, () => {
	console.log('Started on port 3000');
});
