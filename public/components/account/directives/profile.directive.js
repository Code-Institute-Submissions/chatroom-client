chatroom
    .directive('profile', function () {
        return{
            restrict: "E", 
            templateUrl : "public/components/account/templates/profile.info.html",
            controller: 'AccountController'
        };
    });