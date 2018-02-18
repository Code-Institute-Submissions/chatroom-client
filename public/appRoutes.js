angular
.module('appRoutes', ["ui.router"])
.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$windowProvider', function($stateProvider, $urlRouterProvider, $locationProvider, $windowProvider) {
    $locationProvider.html5Mode(true);

    $stateProvider.state({
        name: 'home',
        url: '/',
        templateUrl: '/public/components/profile/templates/home.template.html',
        controller: 'ProfileController'
    }).state({
        name: 'register',
        url: '/register',
        templateUrl: '/public/components/profile/templates/register.template.html',
        controller: 'ProfileController'
    }).state({
        name: 'messages',
        url: '/rooms/:room_id/messages',
        templateUrl: '/public/components/messages/templates/messages.index.html',
        controller: 'MessageController'
    }).state({
        name: 'reset',
        url: '/password_reset',
        templateUrl: '/public/components/profile/templates/password.reset.html',
        controller: 'ProfileController'
    }).state({
        name: 'rooms_list',
        url: '/users/:user_id',
        templateUrl: '/public/components/room/templates/room.list.html',
        controller: 'RoomController'
    }).state({
        name: 'profile',
        url: '/users/:user_id/profile',
        templateUrl: '/public/components/profile/templates/profile.index.html',
        controller: 'ProfileController'
    }).state({
        name: 'subscriptions',
        url: '/users/:user_id/subscriptions',
        templateUrl: '/public/components/subscription/templates/subscription.index.html',
        controller: 'SubscriptionController'
    });

    $urlRouterProvider.otherwise('/');

    $window = $windowProvider.$get();
    $window.Stripe.setPublishableKey('pk_test_I3u9O19d5x4QyY39NPdFS4Bl');
}]);