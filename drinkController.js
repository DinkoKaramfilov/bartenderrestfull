var config = require('./config.json');
var pumpController = require('./pumpController');

var pinsToOpen = config.ingredients.map(ing => ing.pin);
pumpController.init(pinsToOpen);

module.exports = {
	makeDrink(drinkID){
		var drink = config.drinks.find(r => r.id == drinkID);
	
		if (!drink){
			throw 'Recipe not found.';
		}
		
		var ingredientIDs = Object.keys(drink.recipe);
		
		for (var i = 0; i < ingredientIDs.length; i++){
			var ingredientID = ingredientIDs[i];
			var ingredient = config.ingredients.find(n => n.id == ingredientID);
			
			if (!ingredient){
				throw 'Ingredient not found: ' + ingredientID;
			}
			
			var ounces = drink.recipe[ingredientID];
			var millisToRun = ounces * config.millisPerOunce;
			pumpController.runPump(ingredient.pin, millisToRun);
		}
	}
};
