var config = require('./config.json');
var gpioController = require('./gpioController');

var queue, busy;

function makeNextDrink(){
		
	if (busy){
		return 'I\'M VERY BUSY. PLEASE WAIT.';
	}
	
	if (!queue.length){
		return 'No drinks are in the queue.';
	}
	
	busy = true;
	
	var drinkConfig = queue.shift();
	
	var maxTime = 0;
	
	for (var ingredientID in drinkConfig.recipe){
		var ingredientConfig = config.ingredients.find(n => n.id == ingredientID);
		
		if (!ingredientConfig){
			return 'Ingredient not found: ' + ingredientID;
		}
		
		var ounces = drinkConfig.recipe[ingredientID];
		var millisToRun = ounces * config.millisPerOunce;
		
		maxTime = Math.max(maxTime, millisToRun);
		gpioController.pinOnDuration(ingredientConfig.pin, millisToRun);
	}
	
	setTimeout(() => {
		busy = false;
		console.log(queue.length ? 
			'The next drink on the queue is ' + queue[0].displayName + '. Press the button.'
			: 'There are no more drinks in the queue. Order more.'
		);
	}, maxTime + 1000);
	
	return 'Making ' + drinkConfig.displayName;
}

module.exports = {
	init(){
		queue = [];
		busy = false;
		
		var pumpPins = config.ingredients.map(ing => ing.pin);
		gpioController.init([config.buttonPin], pumpPins);

		gpioController.onPress(config.buttonPin, () => {
			console.log('You pressed the button!');
			var msg = makeNextDrink();
			console.log(msg);
		});
		return this;
	},
	queueDrink(drinkID){
		
		var drink = config.drinks.find(d => d.id == drinkID);
		if (!drink){
			return 'That drink doesn\'t exist! ' + drinkID;
		}
		
		queue.push(drink);
		return 'Request received for ' + drink.displayName + '. It is #' + queue.length + ' in queue.';
	},
	getConfig(){
		return config;
	}
};
