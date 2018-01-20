chatroom
    .directive('add', function () {
        return{
            restrict: "E", 
            templateUrl : "public/components/room/templates/room.add.html",
            controller: 'RoomController'
        };
    });