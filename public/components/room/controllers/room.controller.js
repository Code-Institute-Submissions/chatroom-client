chatroom
    .controller('RoomController', function ($scope, $state, $cookies, $timeout, RoomService) {
        console.log("Room Controller Loaded");
        var LIMIT = 10;

        $scope.fetchingMessages = false;

        $scope.user = $cookies.getObject('user');
        $scope.roomId = $cookies.get('roomId');

        $scope.date_now = Date();

        $scope.messages = [];
        $scope.message = [];
        $scope.rooms = [];
        $scope.newRoom = {};
        $scope.inputMessage = "";

        var socket = io.connect();

        socket.on('broad', function (message) {
            $scope.$apply(function () {
                console.log("Message Broadcasted!!", message);
                $scope.messages.push(message);
            });
        });

        socket.on('changeRoom', function () {
            console.log("Changed to room number", $scope.roomId);
            socket.emit('room-', {
                room_id: $scope.roomId,
                message: $scope.user.email + ' has joined room number: ' + $scope.roomId
            });
        });

        socket.on('connect', function () {
            console.log("Connected to room number", $scope.roomId);
        });

        if (!$scope.roomId) {
            $scope.roomId = 1;
            $cookies.put('roomId', 1);
            console.log("Room ID: ", $scope.roomId);
        }

        $scope.onScroll = function (event, element) {
            if (!$scope.fetchingMessages && element[0].scrollTop === 0) {
                $scope.loadRoom($scope.roomId, false);
                console.log("Scroll Event: ", event);
            }
        }

        $scope.loadRoom = function (room_id, onload) {
            if (onload) {
                applyLoadingClasses('Loading');
            };

            if ($scope.fetchingMessages) {
                return;
            }
            $scope.fetchingMessages = true;

            if (room_id !== $scope.roomId) {
                $cookies.put('roomId', room_id);
                $scope.roomId = room_id;
                $scope.messages = [];
            }

            offset = $scope.messages.length;
            RoomService.get('room_messages/' + room_id,
                {
                    'params': {
                        'offset': offset,
                        'limit': LIMIT
                    }
                },
                loadRoomSuccess,
                loadRoomFailure);
        };

        function loadRoomSuccess(response) {
            console.log("Load Room Success", response);
            var initialLoad = $scope.messages.length == 0 ? true : false;

            var message_data = response.data;

            for(let i = 0; i < message_data.length; i++){
                debugger;
                $scope.messages.push(message_data[i]);
            }

            // IE doesn't support es6 JS and I can't find a decent shim package that works!
            // Object.values(response.data).forEach(data => {
            //     $scope.messages.push(data);
            // });
            console.log("User", $scope.user);

            $scope.fetchingMessages = false;

            socket.emit('join', $scope.roomId, function () {
                console.log('joined: ' + $scope.room_id);
            });
            applyLoadingClasses('Loaded');
            setTimeout(function () {
                if (initialLoad && $state.current.name == 'rooms') {
                    $timeout(function () {
                        var scrollHeight = $('#message-viewport')[0].scrollHeight;
                        $('#message-viewport')[0].scrollTop = scrollHeight;
                    });
                    
                }
            }, 1000);
        };

        function loadRoomFailure(response) {
            $scope.fetchingMessages = false;
            console.log('message failure', response.data);
            applyLoadingClasses('Loaded');
        };

        function createMessage() {
            return {
                'user': $scope.user,
                'message': $scope.inputMessage,
                'room': $scope.roomId,
                'date_added': Date()
            };
        }

        $scope.sendMessage = function () {
            RoomService.post('write_message/',
                {
                    'user': $scope.user.id,
                    'message': $scope.inputMessage,
                    'room': $scope.roomId,
                    'date_added': Date()
                },
                messageAddedSuccess,
                messageAddedFailed);
        };

        function messageAddedSuccess(response) {
            console.log('message added', response.data);

            $scope.message = createMessage();

            socket.emit('messages', {
                room_id: $scope.roomId,
                message: $scope.message
            });

            $scope.inputMessage = "";

            $timeout(function () {
                var scrollHeight = $('#message-viewport')[0].scrollHeight;
                $('#message-viewport')[0].scrollTop = scrollHeight;
            });
        };

        function messageAddedFailed(response) {
            console.log('message added failure', response);
        };

        $scope.addPublicRoom = function () {
            RoomService.post('add/',
                {
                    'name': $scope.newRoom.name,
                    'tag': $scope.newRoom.tag,
                    'type': 'public'
                },
                publicRoomAddedSuccess,
                roomAddedFailure)
        };

        function publicRoomAddedSuccess(response) {
            console.log('room added success', response);
            RoomService.post('add_to_room/',
                {
                    'user': $scope.user.id,
                    'room': response.data.id
                },
                userRoomSuccess,
                userRoomFailure);
        };

        function userRoomSuccess(response) {
            console.log('added user room success', response);

            var user = $cookies.getObject('user');
            user.rooms_joined += 1;
            $cookies.putObject('user', user);
            $state.go('rooms');
        };

        function userRoomFailure(response) {
            console.log('user room failure', response.data);
        };

        function roomAddedFailure(response) {
            console.log('room added failure', response);
        };

        function getUserRooms() {
            RoomService.get('user_rooms/',
                {
                    'params': {
                        "user_id": $scope.user.id
                    }
                },
                getUserRoomsSuccess,
                getUserRoomsFailure);
        };

        function getUserRoomsSuccess(response) {
            console.log("user room success", response.data);
            $scope.rooms = response.data;
        };

        function getUserRoomsFailure(response) {
            console.log(response);
        };

        $scope.applyLocationMarker = function (room_id) {
            if (room_id === parseInt($scope.roomId)) {
                return 'fa fa-map-marker';
            }
        }

        $scope.canSendDirectMessages = function (userId, isSubscribed) {
            return $scope.user.id !== userId && isSubscribed;
        }

        function applyLoadingClasses(transition) {
            switch (transition) {
                case 'Loading':
                    $('#loading-screen').removeClass('hidden');
                    $('#loaded-screen').addClass('hidden');
                    break;
                case 'Loaded':
                    $('#loading-screen').fadeOut('slow', function(){
                        $('#loading-screen').addClass('hidden');
                        $('#loaded-screen').removeClass('hidden');
                    });
                    break;
                default:
                    // When fetching messages on scroll. 
                    // Don't want to apply any classes
                    break;
            }
        }

        $scope.loadRoom($scope.roomId, true);
        getUserRooms();
    });