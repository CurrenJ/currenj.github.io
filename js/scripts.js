$(document).ready(function() {   
    $("#cj").hide();
    $("#com").hide();
    
    $.when( $("#cj").fadeIn(1500) ).done(function() {
        $("#com").fadeIn(4000);
    });
});
