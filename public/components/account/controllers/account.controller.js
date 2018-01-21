chatroom
    .controller('AccountController', function ($scope, $state, $cookies, $timeout, AccountService, RoomService, RestauthService, Upload) {
        console.log("Accounts Controller Loaded");

        if (!$scope.user) {
            $scope.user = $cookies.getObject('user');
            console.log("account user", $scope.user);
        };

        var socket = io.connect();

        $scope.token_id = "";

        $scope.number;
        $scope.expiry;
        $scope.cvc;

        $scope.profileImage = '';
        $scope.croppedProfileImage = '';

        var handleFileSelect = function (evt) {
            var file = evt.currentTarget.files[0];
            var reader = new FileReader();
            reader.onload = function (evt) {
                $scope.$apply(function ($scope) {
                    $scope.profileImage = evt.target.result;
                });
            };
            reader.readAsDataURL(file);
        };
        angular.element(document.querySelector('#fileInput')).on('change', handleFileSelect);

        $scope.upload = function (dataUrl, name) {
            Upload.upload({
                url: 'upload/',
                data: {
                    file: Upload.dataUrltoBlob(dataUrl, name)
                },
            }).then(function (response) {
                $scope.updateUserDetails();
            }, function (response) {
                if (response.status > 0) $scope.errorMsg = response.status
                    + ': ' + response.data;
            }, function (evt) {
                $scope.progress = parseInt(100.0 * evt.loaded / evt.total);
            });
        }

        $scope.userLogin = function () {
            RestauthService.post('login/',
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

        $scope.getUser = function (user_id) {
            AccountService.get('user/' + user_id + '/',
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

        $scope.updateUserDetails = function () {
            var profile_path = $scope.picFile ? "/media/profile_images/" + $scope.picFile.name : $scope.user.profile_picture_path;
            AccountService.patch("update/" + $scope.user.id + '/',
                {
                    'username': $scope.user.username,
                    'email': $scope.user.email,
                    'display_name': $scope.user.display_name,
                    'first_name': $scope.user.first_name,
                    'last_name': $scope.user.last_name,
                    'phone_number': $scope.user.phone_number,
                    'profile_picture_path': profile_path
                },
                updateDetailsSuccess,
                updateDetailsFailure
            );
        };

        $scope.createSubscription = function (code, result) {
            if (result.error) {
                // Add error messages to screen
                updateDetailsFailure();
            } else {
                $scope.token_id = result.id;
                AccountService.put("subscribe/",
                    {
                        'user': {
                            'email': $scope.user.email,
                            'is_subscribed': true,
                            'subscription_end': Date(),
                            'stripe_id': $scope.token_id
                        },
                        'stripe_token': result.id
                    },
                    updateDetailsSuccess,
                    updateDetailsFailure)
            }
        };

        function updateDetailsSuccess(response) {
            $scope.user = response.data;
            $cookies.putObject('user', $scope.user);
            $scope.croppedProfileImage = "";
            $scope.picFile = "";
            console.log(response.data);
        };

        function updateDetailsFailure(response) {
            console.log(response.data);
        };

        $scope.registerUser = function () {
            RestauthService.post('registration/',
                {
                    'username': $scope.user.email,
                    'email': $scope.user.email,
                    'password1': $scope.user.password,
                    'password2': $scope.user.password2,
                    "display_name": $scope.user.display_name,
                    'profile_picture_path': 'media/generic_profile_picture.jpg'
                },
                registerSuccess,
                registerFailure)
        };

        function registerSuccess(response) {
            console.log('register success', response.data);

            // response from registration success returns a user: id
            RoomService.post('add_to_room/',
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

        $scope.logout = function () {
            RestauthService.post('logout/',
                null,
                logoutSuccess,
                logoutFailure);
        };

        function logoutSuccess(response) {
            socket.disconnect();
            $cookies.remove('user');
            $cookies.remove('room_id');
            $state.go('home');
        };

        function logoutFailure(response) {
            console.log('logout failure', response);
        };

        $scope.resetPassword = function () {
            RestauthService.post('password/change/',
                {
                    'username': $scope.user.username,
                    'password': $scope.user.password,
                    'old_password': $scope.user.password,
                    'new_password1': $scope.new_password1,
                    'new_password2': $scope.new_password2
                },
                resetSuccess,
                resetFailure);
        }

        function resetSuccess(response) {
            console.log('reset success', response);
        }

        function resetFailure(response) {
            console.log("reset failure", response);
        }
    });