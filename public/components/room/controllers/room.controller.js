chatroom
    .controller('RoomController', function ($scope, $state, $cookies, RoomService) {
        console.log("Room Controller Loaded");

        //var socket = Socket();
        var socket = io.connect();

        var addMessage = function () {
            $(
                '<h5 class="mt-0" ng-if="user.first_name">' +
                '<strong>{{view_message.user.username}}</strong>' +
                '<small>{{view_message.date_added | date : "medium" }}</small>' +
                '</h5>' +
                '<h5 class="mt-0" ng-if="user.first_name">' +
                '<strong>{{view_message.user.username}}</strong>' +
                '<small>{{view_message.date_added | date : "medium" }}</small>' +
                '</h5>' +
                '<p>{{ view_message.message }}</p>'
            ).appendTo('#messages-content');
        };

        socket.on('broad', function (message) {
            $scope.$apply(function () {
                console.log("Message Broadcasted!!");
                $scope.messages.push(message);
            });
        });

        socket.on('changeRoom', function(){
            console.log("Changed to room number", $scope.roomId);
            socket.emit('room-', {
                room_id: $scope.roomId,
                message: $scope.user.email + ' has joined room number: ' + $scope.roomId
            });
        });

        socket.on('connect', function () {
            console.log("Connected to room number", $scope.roomId);
        });

        $scope.user = $cookies.getObject('user');
        $scope.roomId = $cookies.get('roomId');

        $scope.messages = {};
        $scope.message = {};
        $scope.rooms = {};
        $scope.newRoom = {};
        $scope.inputMessage = "";

        if (!$scope.roomId) {
            $scope.roomId = 1;
            $cookies.put('roomId', 1);
            console.log("Room ID: ", $scope.roomId);
        }

        $scope.loadRoom = function (room_id) {
            $cookies.put('roomId', room_id);
            $scope.roomId = room_id;

            RoomService.get('v1/chatroom/' + room_id + '/get_messages/',
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

        function createMessage(){
            return {
                'user': $scope.user,
                'message': $scope.inputMessage,
                'room': $scope.roomId,
                'date_added': Date()
            };
        }

        $scope.sendMessage = function () {
            $scope.message = createMessage();
            
            socket.emit('messages', {
                room_id: $scope.roomId,
                message: $scope.message
            });
            
            $scope.inputMessage = "";

            // RoomService.post('v1/write_messages/',
            //     {
            //         'user': $scope.user.id,
            //         'message': $scope.inputMessage,
            //         'room': $scope.roomId,
            //         'date_added': Date()
            //     },
            //     messageAddedSuccess,
            //     messageAddedFailed);
        };

        function messageAddedSuccess(response) {
            debugger;
            console.log('message added', response.data);

            //loadRoom($scope.roomId)
            // socket.emit('messages', {
            //     message: $scope.inputMessage
            // });

            socket.emit('message', $scope.inputMessage, function () {
                addMessage($scope.inputMessage);
            });
            $scope.inputMessage = "";
        };

        function messageAddedFailed(response) {
            console.log('message added failure', response);
        };

        $scope.addRoom = function () {
            RoomService.post('v1/chatroom/',
                {
                    'name': $scope.newRoom.name,
                    'tag': $scope.newRoom.tag
                },
                roomAddedSuccess,
                roomAddedFailure)
        };

        function roomAddedSuccess(response) {
            console.log('room added success', response);

            RoomService.post('v1/user_rooms/',
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
            RoomService.get('v1/user_rooms/' + $scope.user.id + '/get_rooms/',
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

        $scope.logout = function () {
            RoomService.post('v1/rest-auth/logout/',
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

        $scope.loadRoom($scope.roomId);
        getUserRooms();
    });