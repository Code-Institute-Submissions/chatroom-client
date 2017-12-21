chatroom
.factory('RoomService', function($resource) {
    return $resource(
        'http://localhost:8000/v1/rooms/:id/',
        {},
        {
            'query': {
                method: 'GET',
                isArray: true,
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
