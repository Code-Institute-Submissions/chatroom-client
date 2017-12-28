chatroom
    .factory('RoomStore', function($cookies) {
        var RoomStore = function() {
            var rooms = []
            
            function get (id){
                return rooms.filter(x => x.id === id);
            };

            function addRooms (roomObjects) {
                debugger;
                roomObjects.forEach(room => {
                    $cookies.putObject(room.name, room);
                });
            };

            function addRoom (key, value) {
                ; 
            };

            return { 
                'get': get,
                'addRooms': addRooms,
                'addRoom': addRoom
            };
        }

        return RoomStore();
    });