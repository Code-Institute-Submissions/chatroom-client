chatroom
    .controller('RoomController', function ($scope, $state, $cookies, RoomService) {
        console.log("Room Controller Loaded");

        $scope.user = $cookies.getObject('user');
        $scope.roomId = $cookies.get('roomId');
        var socket = io.connect('http://localhost:8081');
        
        $scope.messages = {};
        $scope.rooms = {};
        $scope.newRoom = {};
        $scope.inputMessage = "";
        
        if(!$scope.roomId){
            $scope.roomId = 1;
            $cookies.put('roomId', 1);
            console.log("Room ID: ", $scope.roomId );
        } 

        $scope.loadRoom = function(room_id){
            $cookies.put('roomId', room_id);
            RoomService.get('v1/chatroom/'+ room_id + '/get_messages/', 
                null, 
                loadRoomSuccess,
                loadRoomFailure);
        };

        function loadRoomSuccess (response) {
            $scope.messages = response.data;

            socket.on('connect', function (data) {
                socket.emit('join', 'Hello World from ' + $scope.user.name);
            });

            console.log("socket", socket);
        };

        function loadRoomFailure (response) {
            console.log('message failure', response.data);
        };
    
        $scope.sendMessage = function(){
            RoomService.post('v1/write_messages/',
                {
                    'user': $scope.user.id,
                    'message': $scope.inputMessage,
                    'room': $scope.roomId,
                    'date_added': Date()
                },
                messageAddedSuccess,
                messageAddedFailed);
        };

        function messageAddedSuccess (response){
            console.log('message added', response.data);
            var message = response.data;

            //loadRoom($scope.roomId)
            socket.emit('messages', $scope.inputMessage);

            socket.on('broad', function(message) {
                debugger;
                $scope.messages.push(message);
            });
            $scope.inputMessage = "";
        };

        function messageAddedFailed(response){
            console.log('message added failure', response);
        };      

        $scope.addRoom = function(){
            RoomService.post('v1/chatroom/',
                {
                    'name': $scope.newRoom.name,
                    'tag': $scope.newRoom.tag
                },
                roomAddedSuccess,
                roomAddedFailure)
        };

        function roomAddedSuccess(response){
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

        function roomAddedFailure(response){
            console.log('room added failure', response);
        };

        function getUserRooms(){
            RoomService.get('v1/user_rooms/' + $scope.user.id + '/get_rooms/',
                null,
                getUserRoomsSuccess,
                getUserRoomsFailure);
        };

        function getUserRoomsSuccess(response){
            console.log("user room success", response.data);
            $scope.rooms = response.data;
        };

        function getUserRoomsFailure(response){
            console.log(response); 
        };

        $scope.logout = function(){
            RoomService.post('v1/rest-auth/logout/', 
                null, 
                logoutSuccess,
                logoutFailure);
        };

        function logoutSuccess(response){
            socket.disconnect();
            $cookies.remove('user');
            $state.go('home');
        };

        function logoutFailure(response){
            console.log('logout failure', response);
        };

        
        $scope.loadRoom($scope.roomId);    
        getUserRooms();
    });