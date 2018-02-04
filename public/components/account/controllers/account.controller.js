chatroom
    .controller('AccountController', function ($scope, $state, $cookies, $timeout, AccountService, RoomService, RestauthService, Upload) {
        console.log("Accounts Controller Loaded");

        var userLoggedIn = false;

        if (!$scope.user) {
            $scope.user = $cookies.getObject('user');
        };

        var socket = io();

        $scope.token_id = "";

        $scope.number;
        $scope.expiry;
        $scope.cvc;

        $scope.profileImage = '';
        $scope.croppedProfileImage = '';

        socket.on('connect-user', function(socket_id) {
            console.log("Connected user Socket Id: ", socket_id);
            $scope.user.socket_id = socket_id;
        });

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
            AccountService.get('users/' + response.data.user + '/',
                null,
                getUserSuccess,
                getUserFailure);
        };

        function loginFailure(response) {
            $scope.errorMessage = "Unable to login with details provided.";
            $('#error-messages').removeClass('hide');

            setTimeout(function () {
                $scope.errorMessage = String.empty;
                $('#error-messages').addClass('hide');
            }, 3000);
        };

        function getUserSuccess(response) {
            $cookies.putObject('user', response.data);

            socket.emit('connect-user', {
                'user_id': response.data.id,
                'display_name': response.data.display_name
            });

            setTimeout(function () {
                $state.go('rooms');
            }, 1500);
        };

        function getUserFailure(response) {
        };

        $scope.updateUserDetails = function () {
            var profile_path = $scope.picFile ? "/media/profile_images/" + $scope.picFile.name : $scope.user.profile_picture_path;
            AccountService.patch("users/" + $scope.user.id + '/',
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
                AccountService.put("users/"+ $scope.user.id,
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
        };

        function updateDetailsFailure(response) {
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
            RoomService.post('user_rooms/',
                {
                    'user': response.data.user,
                    'room': 1
                },
                userRoomSuccess,
                userRoomFailure);
        };

        function registerFailure(response) {
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
            
        }

        function resetFailure(response) {
            
        }
    });