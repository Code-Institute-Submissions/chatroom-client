chatroom
    .controller('RoomController', function ($scope, $state, $cookies, RoomService) {
        console.log("Room Controller Loaded");

        $scope.user = $cookies.getObject('user');
        $scope.roomId = $cookies.get('roomId');

        $scope.messages = {};
        $scope.message = {};
        $scope.rooms = {};
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

        $scope.loadRoom = function (room_id) {
            $cookies.put('roomId', room_id);
            $scope.roomId = room_id;

            RoomService.get('chatroom/get_room_messages/'+room_id,
                null,
                loadRoomSuccess,
                loadRoomFailure);
        };

        function loadRoomSuccess(response) {
            $scope.messages = response.data;

            socket.emit('join', $scope.roomId, function () {
                console.log('joined: ' + $scope.room_id);
            });

            console.log("Room ID: ", $scope.roomId);
            console.log("Messages", response);
            console.log("socket", socket);
        };

        function loadRoomFailure(response) {
            console.log('message failure', response.data);
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
            RoomService.post('chatroom/write_message/',
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
        };

        function messageAddedFailed(response) {
            console.log('message added failure', response);
        };

        $scope.addRoom = function () {
            RoomService.post('chatroom/',
                {
                    'name': $scope.newRoom.name,
                    'tag': $scope.newRoom.tag
                },
                roomAddedSuccess,
                roomAddedFailure)
        };

        function roomAddedSuccess(response) {
            console.log('room added success', response);

            RoomService.post('user_rooms/',
                {
                    'user': $scope.user.id,
                    'room': response.data.id
                },
                userRoomSuccess,
                userRoomFailure);
        };

        function userRoomSuccess(response) {
            console.log('added user room success', response);
            $state.go('rooms');
        };

        function userRoomFailure(response) {
            console.log('user room failure', response.data);
        };

        function roomAddedFailure(response) {
            console.log('room added failure', response);
        };

        function getUserRooms() {
            RoomService.get('chatroom/get_user_rooms/'+$scope.user.id,
                null,
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

        $scope.loadRoom($scope.roomId);
        getUserRooms();
    });