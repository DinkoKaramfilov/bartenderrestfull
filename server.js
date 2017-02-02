var drinkController = require('./drinkController');

var app = require('express')();
app.use(require('cors')());

app.get('/', (req, res) => res.send('This is the RPI Drinkbot!'));
app.get('/config', (req, res) => res.send(config));

app.post('/drink/:drinkID/make', (req, res) => {
	
	try {
		drinkController.makeDrink(req.params.drinkID);
		res.send('ok!');
	} catch (error) {
		console.error(error);
		res.status(500).send(error.message);
		return;
	}
});

app.listen(3000, () => {
	console.log('Started on port 3000');
});
