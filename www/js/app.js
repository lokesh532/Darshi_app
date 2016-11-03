
angular.module('starter', ['ionic','starter.controller', 'ngCordova','ngCordovaBeacon'])
 
.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        if(window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if(window.StatusBar) {
            StatusBar.styleDefault();
        }
    });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

.state('help', {
    url: '/help',
    templateUrl: 'templates/help.html',
    controller: 'SpeechCtrl'
})
.state('home', {
    url: '/home',
    templateUrl: 'templates/home.html',
    controller: 'MainController'
});



   $urlRouterProvider.otherwise('/home');

});

