chatroom
    .factory('UserStore', function() {
        var UserStore = function() {
            var user = []
            console.log(user);
            
            function get (){
                return user[0];
            };

            function addUser (userObject) {
                user.push(userObject);
            };

            function removeUser(){
                user.pop();
            }

            return { 
                'get': get,
                'addUser': addUser,
                'removeUser': removeUser
            };
        }

        return UserStore();
    });