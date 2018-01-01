chatroom
    .factory('ApiService', function($http){
        var ApiService = function() {
            var applicationUrl = 'http://localhost:8000/v1';

            function get(endpoint, data, success, failure){
                var url = applicationUrl.concat('/').concat(endpoint);
               
                return $http.get(url, data)
                    .then(function (result) {
                        success(result);
                    }, function (error) {
                        failure(error);
                    });
            };

            function post(endpoint, data, success, failure){
                var url = applicationUrl.concat('/').concat(endpoint);

                return $http.post(url, data, { })
                    .then(function (result) {
                        success(result);
                    }, function (error) {
                        failure(error);
                    });
            };

            function put(endpoint, data, success, failure){
                var url = applicationUrl.concat('/').concat(endpoint);

                return $http.put(url, data, success, failure)
                    .then(function(data){
                        success(data);
                    }, function(data){
                        failure(data);
                    });
            };

            function patch(endpoint, data, success, failure){
                var url = applicationUrl.concat('/').concat(endpoint);

                return $http.patch(url, data, success, failure)
                    .then(function(data){
                        success(data);
                    }, function(data){
                        failure(data);
                    });
            };

            return {
                'get': get,
                'post': post,
                'put': put,
                'patch': patch
            }
        }

        return ApiService;
    })