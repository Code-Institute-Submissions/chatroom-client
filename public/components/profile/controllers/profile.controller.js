chatroom
    .controller('ProfileController', function ($scope, $state, $cookies, $timeout, ApiService, Upload) {
        var socket = io();
        var apiService = ApiService();

        $scope.token_id = "";

        $scope.number, $scope.expiry, $scope.cvc;

        $scope.profileImage = '';
        $scope.croppedProfileImage = '';

        function onLoad() {
            var userLoggedIn = false;
            if ($cookies.get('user')) {
                $scope.user = $cookies.getObject('user');
                userLoggedIn = true;
            }
            if (userLoggedIn && $state.current.name === 'home') {
                $state.go('rooms_list', { user_id: $scope.user.id });
            }
        }

        socket.on('connect-user', function (socket_id) {
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
            apiService.post('rest-auth/login/',
                {
                    'username': $scope.user.username,
                    'password': $scope.user.password
                },
                loginSuccess,
                loginFailure);
        };

        function loginSuccess(response) {
            $state.go('rooms_list', { user_id: response.data.user });
        };

        function loginFailure(response) {
            $scope.errorMessage = "Unable to login with details provided.";
            $('#error-messages').removeClass('hide');

            setTimeout(function () {
                $scope.errorMessage = String.empty;
                $('#error-messages').addClass('hide');
            }, 3000);
        };


        $scope.updateUserDetails = function () {
            var profile_path = $scope.picFile ? "/media/profile_images/" + $scope.picFile.name : $scope.user.profile_picture_path;
            apiService.patch("users/" + $scope.user.id + '/',
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

        function updateDetailsSuccess(response) {
            $scope.user = response.data;
            $cookies.putObject('user', $scope.user);
            $scope.croppedProfileImage = "";
            $scope.picFile = "";

            $('#update-message').addClass('alert-success');
            $scope.message = "Update profile successfully!";

            setTimeout(function () {
                $timeout(function () {
                    $scope.message = "";
                });
                $('#update-message').removeClass('alert-success');
            }, 2000);
        };

        function updateDetailsFailure(response) {
            $('#update-message').addClass('alert-danger');
            $scope.message = "Failed to update profile!";
            setTimeout(function () {
                $timeout(function () {
                    $scope.message = "";
                });
                $('#update-message').removeClass('alert-danger');
            }, 2000);
        };

        $scope.registerUser = function () {
            apiService.post('rest-auth/registration/',
                {
                    'username': $scope.user.email,
                    'email': $scope.user.email,
                    'password1': $scope.user.password,
                    'password2': $scope.user.password2,
                    "display_name": $scope.user.display_name,
                    'profile_picture_path': 'media/generic_profile_picture.jpg',
                    'rooms_joined': 1
                },
                registerSuccess,
                registerFailure)
        };

        function registerSuccess(response) {
            apiService.post('rooms/add_to_room/',
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
            $state.go('rooms_list', { user_id: response.data.user_id });
        };

        function userRoomFailure(response) {
            
        };

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

        $scope.changePassword = function () {
            apiService.post("rest-auth/password/change/",
                {
                    'data': {
                        'new_password1': $scope.new_password1,
                        'new_password2': $scope.new_password2
                    }
                },
                changePasswordSuccess,
                changePasswordFailure
            );
        }
        
        function changePasswordSuccess(response) {
            
        }

        function changePasswordFailure(response) {
            
        }

        $scope.resetPassword = function () {
            apiService.post('rest-auth/password/reset/',
                {
                    'email': $scope.username,
                },
                resetSuccess,
                resetFailure);
        }

        function resetSuccess(response) {
            
        }

        function resetFailure(response) {
            
        }

        onLoad();
    });