chatroom
    .controller('MenuController', function ($scope, $state, $cookies, $timeout, RoomService, NotificationService) {
        console.log("Menu Controller Loaded");

        $scope.addPublicRoom = function () {
            RoomService.post('add/',
                {
                    'name': $scope.newRoom.name,
                    'tag': $scope.newRoom.tag,
                    'type': 'public', 
                    'user_id': $scope.user.id
                },
                publicRoomAddedSuccess,
                roomAddedFailure)
        };

        function publicRoomAddedSuccess(response) {
            console.log('room added success', response);
        };

        function userRoomSuccess(response) {
            console.log('added user room success', response);

            // var user = $cookies.getObject('user');
            // user.rooms_joined += 1;
            // $cookies.putObject('user', user);
            // $state.go('rooms');
        };

        function userRoomFailure(response) {
            console.log('user room failure', response.data);
        };

        function roomAddedFailure(response) {
            console.log('room added failure', response);
        };
    
    });