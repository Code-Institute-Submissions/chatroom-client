chatroom
    .controller('ProfileController', function ($scope, $state, $cookies, ProfileService, RoomStore) {
        console.log("Profile Controller Loaded");

        $scope.user = $cookies.getObject('user');
        $scope.token_id = "";
        console.log('profile user', $scope.user.is_subscribed);

        $scope.number;
        $scope.expiry;
        $scope.cvc;
        
        $scope.createSubscription = function (code, result) {
            if (result.error) {
                window.alert('it failed! error: ' + result.error.message);
            } else {
                console.log('success! token: ' + result.id);
                // Add code to push token to server.
                $scope.token_id = result.id;
                ProfileService.put('v1/accounts/'+ $scope.user.id + '/subscribe/',
                    {
                        'email': $scope.user.email,
                        'stripe_token': result.id
                    },
                    subscriptionSuccess,
                    subscriptionFailure)
            }
        };

        function subscriptionSuccess(response){
            console.log('subscription success', response);
            user = UserStore.get();
            user.is_subscribed = true;
            user.subscription_end= Date();
            user.stripe_id =  $scope.token_id;

            $state.go('rooms');
        };

        function subscriptionFailure(response){
            console.log('subscription failure', response);
        };
    });