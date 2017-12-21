chatroom.controller('AccountController', function ($scope, AccountService) {
    console.log("Accounts Controller Loaded");

    $scope.user = {};

    AccountService.query().$promise.then(function (data) {
       console.log(data);
    });

    // AccountService.get({ id: 2 }).$promise.then(function (data) {
    //     $scope.user = data;
    // });

    $scope.registerUser = function () {
        debugger;
        AccountService.save({ 
            username: $scope.user.email,
            password: $scope.user.password
        }).$promise.then(function(data){
            console.log("Success response: ", data);
        });
    };
});