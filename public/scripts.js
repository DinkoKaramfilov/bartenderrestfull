// define a module for this application, call it app
var app = angular.module('app', []);

// define a controller in the app
app.controller('ctrl', ($scope, $http) => {

  // to initialize, request the config from the server with an HTTP GET request (Angular's $http makes this simple)
  $http.get('config')
    .then(response => $scope.drinks = response.data.drinks)
    .catch(err => console.error(err));

  // this function is called when you press an Order button
  $scope.order = (drink) => {

    // send an HTTP POST request to the server with the drink id
    $http.post('request/' + drink.id)
      .then(response => alert(response.data))
      .catch(err => console.error(err));
  };

});
