# Bartender
Code to measure liquids, run on a raspberry pi.

After cloning, install dependencies:
```
npm install
```

Then start the server
```
npm start
```

Server is running.
Change drinks/pins in config
Server will restar upon changes

Details for config.json:

"drinks" =should contain an array of objects, + "id" (string),"displayName" (string), and "recipe" (object).
The recipe object's keys must correspond to ingredient ids and values must be the number of ounces to measure.

"ingredients" should contain an array of objects, each with an "id" (string), and "pin" (number) corresponding to the pin
controlling that ingredient.

"millisPerOunce" should be the number of milliseconds required to dispense an ounce.

"buttonPin" should be the pin number that the button is plugged into.

Once the server is running, send a POST request to localhost:3000/request/:drinkID to add the corresponding drink to the queue.
":drinkID" should be the id of a drink in config.json.

Push the button to start making the next drink on the queue.

Send a GET request to localhost:3000/config to get config.json. Use this file to populate the UI.

Send a GET request to localhost:3000 to get the UI.
