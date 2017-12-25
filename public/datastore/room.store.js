chatroom
    .factory('RoomStore', function() {
        var RoomStore = function() {
            var rooms = []
            
            function get (id){
                return rooms.filter(x => x.id === id);
            };

            function addRooms (roomObjects) {
                roomObjects.forEach(room => {
                    rooms.push(room); 
                });
            };

            function addRoom (room) {
                rooms.push(room); 
            };

            return { 
                'get': get,
                'addRooms': addRooms,
                'addRoom': addRoom
            };
        }

        return RoomStore();
    });