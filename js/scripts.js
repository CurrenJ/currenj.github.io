$(document).ready(function() {   
    $("#cj").hide();
    $("#com").css('visibility','hidden')
    $.when( $("#cj").fadeIn(1500) ).done(function() {
        $("#com").fadeIn(4000);
    });
});
