chatroom
    .controller('SubscriptionController', function ($scope, $state, $stateParams, $cookies, $timeout, ApiService) {
        var socket;
        var user_id;

        function onLoad() {
            apiService = ApiService();
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
            $scope.token_id = result.id;
            apiService.put("users/subscribe/",
                {
                    'user': {
                        'email': $scope.user.email,
                        'is_subscribed': true,
                        'subscription_end': Date(),
                    },
                    'stripe_token': result.id
                },
                subscribeSuccess,
                subscribeFailure)
        };

        function subscribeSuccess(response) {
            $scope.user = response.data;
            $cookies.putObject('user', $scope.user);

            $('#subscription-message').addClass('alert-success').removeClass('hide');
            $scope.subscriptionMessage = "Subscription Created Successfully!";

            setTimeout(function () {
                $timeout(function () {
                    $scope.subscriptionMessage = "";
                    $('#subscription-message').removeClass('alert-success').addClass('hide');
                });
            }, 2000);
        };

        function subscribeFailure(response) {
            $('#subscription-message').addClass('alert-danger').removeClass('hide');
            $scope.subscriptionMessage = response.data;
            setTimeout(function () {
                $timeout(function () {
                    $scope.subscriptionMessage = "";
                });
                $('#subscription-message').removeClass('alert-danger').addClass('hide');
            }, 2000);
        };

        onLoad();
    });