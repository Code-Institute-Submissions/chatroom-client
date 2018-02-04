chatroom
    .factory('NotificationService', function(){
        var NotificationService = function(){
            
            function notify(url, message){
                debugger;
                return Lobibox.notify('default', {
                    title: 'Custom title',
                    onClickUrl: url,
                    msg: message,
                    sound: false,
                });
            }
            
            return {
                'notify': notify
            }
        }

        return NotificationService;
    })