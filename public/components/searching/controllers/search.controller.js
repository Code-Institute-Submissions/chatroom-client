chatroom
    .controller('SearchController', function ($scope, $state, $cookies, SearchService) {
        console.log("Search Controller Loaded");

        $scope.user = $cookies.getObject('user');

        $scope.roomSearch = function () {
            SearchService.get('get_rooms/',
                {
                    'params': {
                        'searchTerm': $scope.searchTerm,
                        'userId': $scope.user.id
                    }
                },
                searchSuccess,
                searchFailure);
        }

        function searchSuccess(response) {
            console.log(response.data);
            $scope.searchableRooms = response.data;

        }

        function searchFailure(response) {
            console.log(response);
        }

        $scope.joinRoom = function (room_id) {
            SearchService.post('add_to_room/',
                {
                    'user': $scope.user.id,
                    'room': room_id
                },
                joinRoomSuccess,
                joinRoomFailure);
        }

        function joinRoomSuccess(response) {
            console.log("Joined Successfully", response);
            $scope.message = "Successfully joind the room.";
            $('#success-messages').fadeIn('fast', function(){
                $('#success-messages').removeClass('hide');
            });

            $('#room_' + response.room_id).addClass('disabled');
            console.log($('#room_' + response.room_id));

            setTimeout(function () {
                $scope.message = String.empty;
                $('#success-messages').addClass('hide');
                $state.go('rooms');
            }, 3000);
        }

        function joinRoomFailure(response) {
            console.log("Failed to join room", response);

            $scope.message = "There was an issue while trying to add you to that room.";
            $('#error-messages').removeClass('hide');

            setTimeout(function () {
                $scope.errorMessage = String.empty;
                $('#error-messages').addClass('hide');
            }, 3000);
        }

    });