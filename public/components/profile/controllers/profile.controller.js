chatroom
    .controller('ProfileController', function ($scope, $state, $cookies, $timeout, ApiService, Upload) {
        console.log("Profile Controller Loaded");
        var socket = io();
        var apiService = ApiService();

        $scope.token_id = "";

        $scope.number, $scope.expiry, $scope.cvc;

        $scope.profileImage = '';
        $scope.croppedProfileImage = '';

        function onLoad(){
            var userLoggedIn = false;
            if($cookies.get('user')){
                $scope.user = $cookies.getObject('user');
                console.log("User logged in on profile controller", $scope.user.id, $scope.user.display_name);       
                userLoggedIn = true;        
            }
            if(userLoggedIn && $state.current.name === 'home'){
                console.log("User Already Logged In");
                $state.go('rooms_list', { user_id: $scope.user.id });
            }
        }

        socket.on('connect-user', function (socket_id) {
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
            apiService.post('rest-auth/login/',
                {
                    'username': $scope.user.username,
                    'password': $scope.user.password
                },
                loginSuccess,
                loginFailure);
        };

        function loginSuccess(response) {
            console.log("Login Success");
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

        $scope.createSubscription = function (code, result) {
            if (result.error) {
                // Add error messages to screen
                updateDetailsFailure();
            } else {
                $scope.token_id = result.id;
                apiService.put("users/" + $scope.user.id,
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
            apiService.post('rest-auth/registration/',
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
            apiService.post('chatroom/user_rooms/',
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

        $scope.resetPassword = function () {
            apiService.post('password/change/',
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
            console.log("Password Reset Successfull");
        }

        function resetFailure(response) {
            console.log("Password Reset Failure");
        }

        onLoad();
    });