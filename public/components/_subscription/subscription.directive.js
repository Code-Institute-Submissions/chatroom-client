chatroom
    .directive("subscription", function(){
        return{
            restrict: "E", 
            templateUrl : "public/components/_subscription/subscription.template.html",
            controller : "ProfileController"
        };
    });