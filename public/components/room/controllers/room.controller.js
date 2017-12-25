chatroom
    .controller('RoomController', function ($scope, $state, RoomService, AccountService, UserStore, RoomStore) {
        console.log("Room Controller Loaded");

        $scope.messages = {};
        $scope.rooms = {};
        $scope.room = {};
        $scope.currentRoomId = 1;
        $scope.inputMessage = "";
        $scope.user = UserStore.get(); 

        $scope.logout = function(){
            UserStore.removeUser($scope.user.data.id);

            RoomService.post('v1/rest-auth/logout/', 
                null, 
                logoutSuccess,
                logoutFailure);
        };

        $scope.updateRoomMessages = function (room_id){
            RoomService.get('v1/chatroom/'+ room_id + '/get_messages/', 
                null, 
                getMessagesSuccess,
                getMessagesFailure);

                $scope.currentRoomId = room_id;
        };

        $scope.sendMessage = function(){
            RoomService.post('v1/write_messages/',
                {
                    'user': $scope.user.data.id,
                    'message': $scope.inputMessage,
                    'room': $scope.currentRoomId,
                    'date_added': Date()
                },
                messageAdded,
                messageAddedFailed)
        };

        function messageAdded (response){
            console.log('message added', response);
            $scope.updateRoomMessages($scope.currentRoomId);
            $scope.inputMessage = "";
        }

        function messageAddedFailed(response){
            console.log('message added failure', response);
        }

        function loadGeneralRoom(){
            RoomService.get('v1/chatroom/'+ 1 + '/get_messages/', 
                null, 
                getMessagesSuccess,
                getMessagesFailure);
        };

        function getMessagesSuccess (response) {
            console.log('message success', response.data);
            $scope.messages = response.data;
        };

        function getMessagesFailure (response) {
            console.log('message failure', response.data);
        };

        function getUserRooms(){
            RoomService.get('v1/chatroom/'+ 1 + '/get_messages/', 
                null, 
                getMessagesSuccess,
                getMessagesFailure);
        }

        function logoutSuccess(response){
            UserStore.removeUser($scope.user.data.id);
            $state.go('home');
        };

        function logoutFailure(response){
            console.log('logout failure', response);
        }

        function getUserRooms(user_id){
            RoomService.get('v1/user_rooms/' + user_id + '/get_rooms/',
                null,
                getUserRoomsSuccess,
                getUserRoomsFailure);
        }

        function getUserRoomsSuccess(response){
            $scope.rooms = response.data;    
            RoomStore.addRooms(response.data); 
            $scope.room = RoomStore.get($scope.currentRoomId);
        };

        function getUserRoomsFailure(response){
            console.log(response); 
        };

        
        loadGeneralRoom();
        getUserRooms($scope.user.data.id);
    });