chatroom
    .factory('ApiService', function($http){
        var ApiService = function() {
            var applicationUrl = 'http://localhost:8000';

            function get(endpoint, data, success, failure){
                var url = applicationUrl.concat('/').concat(endpoint);
               
                return $http.get(url, data, success, failure)
                    .then(function(response){
                        success(response);
                    }, function(response){
                        failure(response);
                    });
            };

            function post(endpoint, data, success, failure){
                var url = applicationUrl.concat('/').concat(endpoint);

                return $http.post(url, data, success, failure)
                    .then(function(data){
                        success(data);
                    }, function(data){
                        failure(data);
                    });
            };

            return {
                'get': get,
                'post': post
            }
        }

        return ApiService;
    })