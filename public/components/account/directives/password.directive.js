chatroom
    .directive('password', function () {
        return{
            restrict: "E", 
            templateUrl : "public/components/account/templates/profile.password.html",
            controller: 'AccountController'
        };
    });