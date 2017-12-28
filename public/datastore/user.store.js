chatroom
    .factory('UserStore', function() {
        var UserStore = function() {
            var user = {};
            
            function get (){
                return user;
            };

            function set(key, value){
                user[key] = value;
            }

            function addUser (userObject) {
                user = userObject;
            };

            function removeUser(){
                user = {};
            }

            return { 
                'get': get,
                'set': set,
                'addUser': addUser,
                'removeUser': removeUser
            };
        }

        return UserStore();
    });