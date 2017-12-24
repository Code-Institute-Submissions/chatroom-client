chatroom.controller('RoomController', function ($scope, $state, RoomService, AccountService, UserStore) {
    console.log("Room Controller Loaded");

    $scope.messages = {};
    debugger;
    $scope.user = UserStore.get();

    console.log('user', $scope.user);

    function loadGeneralRoom(){
        RoomService.get('v1/chatroom/'+ 1 + '/get_messages/', 
            null, 
            getMessagesSuccess,
            getMessagesFailure);
    }

    function getMessagesSuccess (response) {
        console.log('message success', response.data);
        $scope.messages = response.data;
    };

    function getMessagesFailure (data) {
        console.log('message failure', data);
    };

    $scope.logout = function(){
        UserStore.removeUser();

        RoomService.post('v1/rest-auth/logout/', 
            null, 
            logoutSuccess,
            logoutFailure);
    }

    function logoutSuccess(response){
        $state.go('home');
    };

    function logoutFailure(response){
        console.log('logout failure', response);
    }
    
    loadGeneralRoom();
});