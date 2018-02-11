chatroom
    .controller('MessageController', function ($scope, $state, $stateParams, $cookies, $timeout, ApiService) {
        console.log("Message Controller Loaded");

        var LIMIT = 10;
        $scope.fetching_messages = false;
        var apiService = ApiService();
        var user_id;
        $scope.room_id;

        $scope.date_now = Date();

        $scope.messages = [];
        $scope.message = [];
        $scope.rooms = [];
        $scope.newRoom = {};
        $scope.input_message = "";

        var socket = io.connect();

        socket.on('broad', function (message) {
            $scope.$apply(function () {
                console.log("Message Broadcasted!!", message);
                $scope.messages.push(message);
            });
        });

        socket.on('changeRoom', function () {
            console.log("Changed to room number", $scope.room_id);
            socket.emit('room-', {
                room_id: room_id,
                message: $scope.user.email + ' has joined room number: ' + room_id
            });
        });

        socket.on('notify-private', function (data) {
            debugger;
            var room_id = data.room_id;
            var message = data.message;
            Lobibox.notify('default', {
                title: 'Custom title',
                msg: message,
                sound: false,
                delay: false,
                onClick: function (room_id) {
                    $scope.loadRoom(room_id);
                }
            });
        });

        $scope.onScroll = function (event, element) {
            if (!$scope.fetching_messages && element[0].scrollTop === 0) {
                $scope.loadRoom(false);
            }
        }

        function scrollSuccess(response) {
            console.log("scroll success");
            var message_data = response.data;

            $scope.fetching_messages = false;

            for (let i = 0; i < message_data.length; i++) {
                $scope.messages.push(message_data[i]);
            }

            // $timeout(function () {
            //     $('#message-viewport')[0].scrollTop = ($('#message-viewport')[0].scrollHeight / 100);
            // });
        }

        $scope.loadRoom = function (initial_load) {
            if (initial_load) {
                console.log("stateparams has a value");
                applyLoadingClasses('Loading');
                room_id = $stateParams.room_id;

                if ($cookies.getObject('user')) {
                    $scope.user = $cookies.getObject('user');
                    console.log("User logged in on room controller", $scope.user);
                } else {
                    user_id = $stateParams.user_id;
                }

                $timeout(function () {
                    $('#message-viewport')[0].scrollTop = $('#message-viewport')[0].scrollHeight;
                });
            };

            if ($scope.fetching_messages) {
                return;
            }
            $scope.fetching_messages = true;

            offset = $scope.messages.length;
            apiService.get('rooms/get_room_messages/' + room_id + '/',
                {
                    'params': {
                        'offset': offset,
                        'limit': LIMIT
                    }
                },
                loadMessagesSuccess,
                loadMessagesFailure);
        };

        function loadMessagesSuccess(response) {
            console.log("Load Room Success", response);

            var message_data = response.data;

            for (let i = 0; i < message_data.length; i++) {
                $scope.messages.push(message_data[i]);
            }
            $scope.fetching_messages = false;

            socket.emit('join', room_id, function () {
                console.log('joined: ' + room_id);
            });

            setTimeout(function () {
                applyLoadingClasses('Loaded');
            }, 2000);
        };

        function loadMessagesFailure(response) {
            $scope.fetching_messages = false;
            applyLoadingClasses('Loaded');
        };

        $scope.changeRoom = function (room_id) {
            $state.go('messages', { room_id: room_id });
        }

        function getUser(user_id) {
            user_id = user_id ? user_id : $scope.user.id;
            apiService.get('users/' + user_id + '/',
                null,
                getUserSuccess,
                getUserFailure);
        }

        function getUserSuccess(response) {
            console.log("Get User Success", response.data);
            $scope.user = response.data;
        }

        function getUserFailure(response) {
            console.log("Get User Failure", response.data);
        }

        function getRooms(user_id) {
            user_id = user_id ? user_id : $scope.user.id;
            apiService.get('rooms/get_user_rooms/' + user_id + '/',
                null,
                getRoomsSuccess,
                getRoomsFailure);
        }

        function getRoomsSuccess(response) {
            console.log("Get Room Success", response.data);
            $scope.users_rooms = response.data;
        }

        function getRoomsFailure(response) {
            console.log("Get User Failure", response.data);
        }

        function createMessage() {
            return {
                'user': $scope.user,
                'message': $scope.input_message,
                'room': room_id,
                'date_added': Date()
            };
        }

        $scope.sendMessage = function () {
            apiService.post('rooms/write_message/',
                {
                    'user': $scope.user.id,
                    'message': $scope.input_message,
                    'room': room_id,
                    'date_added': Date()
                },
                messageAddedSuccess,
                messageAddedFailed)
        };

        function messageAddedSuccess(response) {
            $scope.message = createMessage();

            socket.emit('messages', {
                room_id: room_id,
                message: $scope.message
            });

            $scope.input_message = "";
        };

        function messageAddedFailed(response) {

        };

        function roomAddedFailure(response) {

        };

        $scope.applyLocationMarker = function (id) {
            if (id === parseInt(room_id)) {
                return 'fa fa-map-marker';
            }
        }

        function applyLoadingClasses(transition) {
            switch (transition) {
                case 'Loading':
                    $('#loading-screen').removeClass('hidden');
                    $('#loaded-screen').addClass('hidden');
                    break;
                case 'Loaded':
                    $('#loading-screen').fadeOut('slow', function () {
                        $('#loading-screen').addClass('hidden');
                        $('#loaded-screen').removeClass('hidden');
                    });
                    break;
                default:
                    break;
            }
        }

        $scope.loadRoom(true);
        getUser(user_id);
        getRooms(user_id);
    });