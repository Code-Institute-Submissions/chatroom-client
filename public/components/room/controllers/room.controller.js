chatroom
    .controller('RoomController', function ($scope, $state, $cookies, $stateParams, $timeout, ApiService) {

        var LIMIT = 10;
        $scope.fetchingMessages = false;
        var apiService;
        var user_id;

        $scope.messages = [];
        $scope.message = [];
        $scope.rooms = [];
        $scope.newRoom = {};
        $scope.inputMessage = "";

        var socket = io();

        function onLoad() {
            apiService = ApiService();

            if($cookies.getObject('user')){
                $scope.user = $cookies.getObject('user'); 
            } else {
                user_id = $stateParams.user_id;
            }
        }

        function getUser(user_id) {
            user_id = user_id ? user_id : $scope.user.id;
            apiService.get('users/' + user_id + '/',
                null,
                getUserSuccess,
                getUserFailure);
        }

        function getUserSuccess(response) {
            $cookies.putObject('user', response.data);
            $scope.user = response.data;
        }

        function getUserFailure(response) {
            
        }

        function getRooms(user_id) {
            user_id = user_id ? user_id : $scope.user.id;
            apiService.get('rooms/get_user_rooms/' + user_id  + '/',
                null,
                getRoomsSuccess,
                getRoomsFailure);
        }

        function getRoomsSuccess(response) {
            $scope.users_rooms = response.data;
        }

        function getRoomsFailure(response) {
            
        }

        $scope.addRoom = function () {
            apiService.post('rooms/add_room/',
                {
                    'name': $scope.newRoom.name,
                    'tag': $scope.newRoom.tag,
                    'type': 'public',
                    'user_id': $scope.user.id
                },
                roomAddedSuccess,
                roomAddedFailure)
        };

        function roomAddedSuccess(response) {
            $timeout(function(){
                $state.go("messages", {room_id: response.data.id});
            });
        };

        function userRoomSuccess(response) {

        };

        function userRoomFailure(response) {
            
        };

        function roomAddedFailure(response) {
            
        };

        function roomAddedFailure(response) {
        };

        $scope.applyLocationMarker = function (room_id) {
            if (room_id === parseInt($scope.roomId)) {
                return 'active';
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

        $scope.loadRoom = function (room_id) {
            $state.go('messages', { room_id: room_id });
        }

        $scope.logout = function () {
            apiService.post('rest-auth/logout/',
                null,
                logoutSuccess,
                logoutFailure);
        };

        function logoutSuccess(response) {
            socket.disconnect();

            $cookies.remove('user');
            $state.go('home');
        };

        function logoutFailure(response) {

        };

        $scope.roomSearch = function () {
            apiService.get('rooms/get_rooms/',
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
            $scope.searchableRooms = response.data;
        }

        function searchFailure(response) {
            
        }

        $scope.joinRoom = function (room_id) {
            apiService.post('rooms/add_to_room/',
                {
                    'user': $scope.user.id,
                    'room': room_id
                },
                joinRoomSuccess,
                joinRoomFailure);
        }

        function joinRoomSuccess(response) {
            $scope.message = "Successfully joind the room.";
            $('#success-messages').fadeIn('fast', function(){
                $('#success-messages').removeClass('hide');
            });

            setTimeout(function () {
                $scope.message = String.empty;
                $('#success-messages').addClass('hide');
                $state.go('messages', { room_id: response.data.room_id });
            }, 1000);
        }

        function joinRoomFailure(response) {
            $scope.message = "There was an issue while trying to add you to that room.";
            $('#error-messages').removeClass('hide');

            setTimeout(function () {
                $scope.errorMessage = String.empty;
                $('#error-messages').addClass('hide');
            }, 3000);
        }

        onLoad();
        getUser(user_id);
        getRooms(user_id);
    });