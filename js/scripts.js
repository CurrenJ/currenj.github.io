$(document).ready(function() {   
    $("#cj").hide();
    $("#com").css('opacity','0')
    $.when( $("#cj").fadeIn(1500) ).done(function() {
        $("#com").fadeTo(4000, 1);
        $("#com").animate("padding-left", "-1.25vw");
    });
});
