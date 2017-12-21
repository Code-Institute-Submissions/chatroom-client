angular
.module('appRoutes', ["ui.router"])
.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });

    $stateProvider.state({
        name: 'home',
        url: '/',
        templateUrl: 'public/components/account/templates/home.template.html',
        controller: 'AccountController'
    }).state({
        name: 'register',
        url: '/register',
        templateUrl: 'public/components/account/templates/register.template.html',
        controller: 'AccountController'
    }).state({
        name: 'rooms',
        url: '/rooms',
        templateUrl: 'public/components/room/templates/room.template.html',
        controller: 'RoomController'
    }).state({
        name: 'profile',
        url: '/profile',
        templateUrl: 'public/components/account/templates/profile.template.html',
        controller: 'AccountController'
    });

    $urlRouterProvider.otherwise('/');
}]);