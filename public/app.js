'use strict';

var chatroom = angular.module("chatroom", []);

angular
    .module('ChatroomApplication', ['appRoutes','chatroom', 'ngResource', 'ui.bootstrap']);