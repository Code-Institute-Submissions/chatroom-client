chatroom
    .controller('RoomController', function ($scope, $state, $cookies, $stateParams, $timeout, ApiService) {
        console.log("Room Controller Loaded");

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
                console.log("User logged in on room controller", $scope.user);      
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
            console.log("Get User Success", response.data);
            $cookies.putObject('user', response.data);
            $scope.user = response.data;
        }

        function getUserFailure(response) {
            console.log("Get User Failure", response.data);
        }

        function getRooms(user_id) {
            user_id = user_id ? user_id : $scope.user.id;
            apiService.get('rooms/get_user_rooms/' + user_id  + '/',
                null,
                getRoomsSuccess,
                getRoomsFailure);
        }

        function getRoomsSuccess(response) {
            console.log("Get Room Success", response.data);
            $scope.users_rooms = response.data;
        }

        function getRoomsFailure(response) {
            console.log("Get User Failure", response.data);
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
            console.log('room added success', response);
            $timeout(function(){

            });
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
            console.log(response.data);
            $scope.searchableRooms = response.data;

        }

        function searchFailure(response) {
            console.log(response);
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
            console.log("Joined Successfully", response);
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
            console.log("Failed to join room", response);

            $scope.message = "There was an issue while trying to add you to that room.";
            $('#error-messages').removeClass('hide');

            setTimeout(function () {
                $scope.errorMessage = String.empty;
                $('#error-messages').addClass('hide');
            }, 3000);
        }

        // $scope.loadRoom($scope.roomId, true);
        onLoad();
        getUser(user_id);
        getRooms(user_id);
    });