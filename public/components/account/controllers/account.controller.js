chatroom
    .controller('AccountController', function ($scope, $state, $cookies, AccountService, UserStore) {
        console.log("Accounts Controller Loaded");

        if ($scope.user || $scope.user === 'undefined') {
            $scope.userObject = $cookies.get('user');
            console.log("user object Gotted");
        }

        $scope.getUser = function (user_id) {
            AccountService.get('v1/accounts_reader/' + user_id + '/',
                null,
                getUserSuccess,
                getUserFailure);
        };

        function getUserSuccess(response) {
            console.log('get user success', response.data);
            $cookies.putObject('user', response.data);

            setTimeout(function () {
                $state.go('rooms');
            }, 1500);
        };

        function getUserFailure(data) {
            console.log(data);
        };

        $scope.userLogin = function () {
            AccountService.post('v1/rest-auth/login/',
                {
                    'username': $scope.user.username,
                    'password': $scope.user.password
                },
                loginSuccess,
                loginFailure);
        };

        function loginSuccess(response) {
            console.log('login success', response.data);
            $scope.getUser(response.data.user);
        };

        function loginFailure(response) {
            console.log('login failure', response.data);

            $scope.errorMessage = "Unable to login with details provided.";
            $('#error-messages').removeClass('hide');

            setTimeout(function () {
                $scope.errorMessage = String.empty;
                $('#error-messages').addClass('hide');
            }, 3000);
        };

        $scope.registerUser = function () {
            AccountService.post('v1/rest-auth/registration/',
                {
                    'username': $scope.user.email,
                    'email': $scope.user.email,
                    'password1': $scope.user.password,
                    'password2': $scope.user.password2
                },
                registerSuccess,
                registerFailure)
        };

        function registerSuccess(response) {
            console.log('register success', response.data);

            AccountService.post('v1/user_rooms/',
                {
                    'user': response.data.user,
                    'room': 1
                },
                userRoomSuccess,
                userRoomFailure);
        };

        function registerFailure(response) {
            console.log('register failure', response.data);
            $scope.errorMessage = response.data;
            $('#error-messages').removeClass('hide');

            setTimeout(function () {
                $scope.errorMessage = String.empty;
                $('#error-messages').addClass('hide');
            }, 3000);
        };

        function userRoomSuccess(response) {
            $scope.getUser(response.data.user);
        };

        function userRoomFailure(response) {
            console.log('user room failure', response.data);
        };
    });