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
            RoomService.get('messages/' + room_id,
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
            var initialLoad = $scope.messages.length == 0 ? true : false;

            var message_data = response.data;

            for (let i = 0; i < message_data.length; i++) {
                $scope.messages.push(message_data[i]);
            }
            $scope.fetchingMessages = false;

            socket.emit('join', $scope.roomId, function () {
                console.log('joined: ' + $scope.room_id);
            });

            setTimeout(function () {
                $timeout(function () {
                    var scrollHeight = $('#message-viewport')[0].scrollHeight;
                    $('#message-viewport')[0].scrollTop = scrollHeight;
                });
            }, 1000);

            applyLoadingClasses('Loaded');
        };

        function loadMessagesFailure(response) {
            $scope.fetchingMessages = false;
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
            RoomService.post('messages/',
                {
                    'user': $scope.user.id,
                    'message': $scope.inputMessage,
                    'room': $scope.roomId,
                    'date_added': Date()
                },
                messageAddedSuccess,
                messageAddedFailed)
        };

        function messageAddedSuccess(response) {
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
            
        };

        function roomAddedFailure(response) {
        };

        $scope.applyLocationMarker = function (room_id) {
            if (room_id === parseInt($scope.roomId)) {
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

        function getRooms() {
            RoomService.get('user_rooms/' + $scope.user.id,
                null,
                getRoomsSuccess,
                getRoomsFailure);
        };

        function getRoomsSuccess(response) {
            console.log("user room success", response.data);
            $scope.rooms = response.data;
        };

        function getRoomsFailure(response) {
            console.log(response);
        };

        $scope.loadRoom($scope.roomId, true);
        getRooms();
    });