chatroom
    .factory('AccountService', function($resource) {
        return $resource(
            'http://localhost:8000/v1/accounts/:id/',
            {},
            {
                'query': {
                    method: 'GET',
                    isArray: true,
                    headers: {
                        'Content-Type':'application/json',
                    }
                },
                'update': {
                    method: 'POST',
                    headers: {
                        'Content-Type':'application/json',
                    }
                }
            },
            {
                stripTrailingSlashes: false
            }
        );
    });

     // chatroom
    // .factory('AccountService', function($resource) {
    //     var url = 'http://localhost:8000/v1/accounts';
    //     var AccountService ={
    //         getAll: getAll,
    //         get: get,
    //         create: create,
    //         save: save
    //     }

        

    //     return AccountService;
    // });