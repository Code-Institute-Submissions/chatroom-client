chatroom
    .controller('SubscriptionController', function ($scope, $state, $stateParams, $cookies, $timeout, ApiService) {
        console.log("Subscription Controller Loaded");

        function onLoad() {
            apiService = ApiService();
            user_id = $stateParams.user_id;

            if($cookies.getObject('user')){
                $scope.user = $cookies.getObject('user');
                console.log("USer logged in on room controller", $scope.user);      
            }
        }

        $scope.logout = function () {
            apiService.post('rest-auth/logout/',
                null,
                logoutSuccess,
                logoutFailure);
        };
    
        function logoutSuccess(response) {
            socket.disconnect();
    
            $cookies.remove('user');
            $state.go('home');
        };
    
        function logoutFailure(response) {
    
        };

        
        onLoad();
    });