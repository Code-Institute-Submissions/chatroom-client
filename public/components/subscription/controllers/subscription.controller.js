chatroom
    .controller('SubscriptionController', function ($scope, $state, $stateParams, $cookies, $timeout, ApiService) {
        var socket;
        
        function onLoad() {
            apiService = ApiService();
            user_id = $stateParams.user_id;
            socket = io();

            if ($cookies.getObject('user')) {
                $scope.user = $cookies.getObject('user');
            } else {
                user_id = $stateParams.user_id;
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

        $scope.createSubscription = function (code, result) {
            if (result.error) {
                updateDetailsFailure();
            } else {
                $scope.token_id = result.id;
                apiService.put("users/subscribe/",
                    {
                        'user': {
                            'email': $scope.user.email,
                            'is_subscribed': true,
                            'subscription_end': Date(),
                            'stripe_id': $scope.token_id
                        },
                        'stripe_token': result.id
                    },
                    subscribeSuccess,
                    subscribeFailure)
            }
        };

        function subscribeSuccess(response) {
            $scope.user = response.data;
            $cookies.putObject('user', $scope.user);
            $scope.croppedProfileImage = "";
            $scope.picFile = "";

            $('#subscription-message').addClass('alert-success').removeClass('hide');
            $scope.subscription_message = "Subscription Created Successfully!";

            setTimeout(function () {
                $timeout(function () {
                    $scope.subscription_message = "";
                    $scope.user.is_subscribed = true;
                });
                $('#subscription-message').removeClass('alert-success').addClass('hide');
            }, 2000);
        };

        function subscribeFailure(response) {
            $('#subscription-message').addClass('alert-danger').removeClass('hide');
            $scope.message = "Failed to to make payment this time!";
            setTimeout(function () {
                $timeout(function () {
                    $scope.message = "";
                });
                $('#subscription-message').removeClass('alert-danger').addClass('hide');
            }, 2000);
        };

        $scope.cancelSubscription = function () {
            apiService.post('users/cancel_subscription/' +  $scope.user.id + '/',
                null,
                cancelSuccess,
                cancelFailure)
        }

        function cancelSuccess(response) {
            
        }

        function cancelFailure(response) {
            
        }

        onLoad();
    });