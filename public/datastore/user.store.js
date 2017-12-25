chatroom
    .factory('UserStore', function() {
        var UserStore = function() {
            var user = []
            
            function get (){
                return user[0];
            };

            function getById (id){
                return user.filter(x => x.id === id);
            };

            function addUser (userObject) {
                user.push(userObject);
            };

            function removeUser(id){
                user.pop(x => x.id === id);
            }

            return { 
                'get': get,
                'getById': getById,
                'addUser': addUser,
                'removeUser': removeUser
            };
        }

        return UserStore();
    });