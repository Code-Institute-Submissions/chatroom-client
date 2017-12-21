var main = function () {

    /* Push the body and the nav over by 285px over */
    $('#menu-open').click(function () {
        console.log("Clicked open");
        $('#menu').animate({ left: "0" }, 200);
        $('#message-input').animate({
            width: "85%",
            left: "15%"
        }, 200);
        $('#message-viewport').animate({
            width: "85%",
            left: "15%"
        }, 200);
    });

    /* Then push them back */
    $('#menu-close').click(function () {
        $('#menu').animate({ left: "-15%" }, 200);
        $('#message-input').animate({
            width: "100%",
            left: "0"
        }, 200);
        $('#message-viewport').animate({
            width: "100%",
            left: "0"
        }, 200);
    });
};


$(document).ready(function(){
    console.log("toggle-menu loaded");
    main();
});