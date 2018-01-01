angular
.module('appRoutes', ["ui.router"])
.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$windowProvider', function($stateProvider, $urlRouterProvider, $locationProvider, $windowProvider) {
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
        name: 'profile',
        url: '/profile',
        templateUrl: 'public/components/account/templates/profile.template.html',
        controller: 'AccountController'
    }).state({
        name: 'rooms',
        url: '/user_rooms',
        templateUrl: 'public/components/room/templates/room.template.html',
        controller: 'RoomController'
    }).state({
        name: 'addRoom',
        url: '/addRoom',
        templateUrl: 'public/components/room/templates/addRoom.template.html',
        controller: 'RoomController'
    }).state({
        name: 'subscription',
        url: '/subscription',
        templateUrl: 'public/components/account/templates/subscription.template.html',
        controller: 'AccountController'
    }).state({
        name: 'reset',
        url: '/password_reset',
        templateUrl: 'public/components/account/templates/password-reset.template.html',
        controller: 'AccountController'
    });

    $urlRouterProvider.otherwise('/');

    $window = $windowProvider.$get();
    $window.Stripe.setPublishableKey('pk_test_I3u9O19d5x4QyY39NPdFS4Bl');
}]);