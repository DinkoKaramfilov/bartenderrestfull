# rpi-drinkbot
Code to measure liquids, run on a raspberry pi.

After cloning, install dependencies:
```
npm install
```

Then start the server
```
npm start
```

Now the server is running. Make changes to config as needed, the server will restart automatically after changes.

Details for config.json:

"drinks" should contain an array of objects, each with an "id" (string), "displayName" (string), and "recipe" (object). 
The recipe object's keys must correspond to ingredient ids and values must be the number of ounces to measure. 

"ingredients" should contain an array of objects, each with an "id" (string), and "pin" (number) corresponding to the pin 
controlling that ingredient.

"millisPerOunce" should be the number of milliseconds required to dispense an ounce.



Once the server is running, send a POST request to host:3000/drink/:drinkID/make to make the corresponding drink.
":drink" should be the id of a drink in config.json.

Send a GET request to host:3000/config to get the whole config.json file. Use this file to populate the UI.