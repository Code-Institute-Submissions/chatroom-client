chatroom
    .directive('scroll', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                element.on("scroll", function (event) {
                    scope.onScroll(event, element);
                    
                });
            }
        }
    });