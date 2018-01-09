chatroom
    .controller('SearchController', function ($scope, $state, $cookies, SearchService) {
        console.log("Search Controller Loaded");

        $scope.roomSearch = function() {
            SearchService.get('chatroom/get_rooms/',
                {
                    params:{
                        name: $scope.room_name ? $scope.room_name : null,
                        tag: $scope.tag ? $scope.tag : null
                    }
                },
                onLoadSuccess,
                onLoadFailure);
        }

        function onLoadSuccess(response) {
            console.log(response.data);
            $scope.searchableRooms = response.data;

        }

        function onLoadFailure(response) {
            console.log(response);
        }

        $scope.joinRoom = function () {
            Searchservice.post('',
                {},
                joinRoomSuccess,
                joinRoomFailure);
        }

        function joinRoomSuccess(response){
            console.log("Joined Successfully", response);
        }

        function joinRoomFailure(response){
            console.log("Failed to join room", response);
        }

    });