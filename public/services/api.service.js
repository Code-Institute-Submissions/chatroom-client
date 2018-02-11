chatroom
    .factory('ApiService', function($http){
        var ApiService = function() {
            var applicationUrl = 'https://chatrooms-server.herokuapp.com/v1/';
            //var applicationUrl = 'http://localhost:8000/v1/';            

            function get(url, data, success, failure){
                url = applicationUrl.concat(url);
                return $http.get(url, data)
                    .then(function (result) {
                        success(result);
                    }, function (error) {
                        failure(error);
                    });
            };

            function post(url, data, success, failure){
                url = applicationUrl.concat(url);
                return $http.post(url, data, { })
                    .then(function (result) {
                        success(result);
                    }, function (error) {
                        failure(error);
                    });
            };

            function put(url, data, success, failure){
                url = applicationUrl.concat(url);
                return $http.put(url, data, success, failure)
                    .then(function(data){
                        success(data);
                    }, function(data){
                        failure(data);
                    });
            };

            function patch(url, data, success, failure){
                url = applicationUrl.concat(url);
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