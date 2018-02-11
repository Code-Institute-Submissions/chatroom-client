chatroom
    .directive("subscription", function(){
        return{
            restrict: "E", 
            templateUrl : "public/components/subscription/templates/subscription.directive.html",
            controller : "SubscriptionController"
        };
    });