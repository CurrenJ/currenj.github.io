$(document).ready(function() {   
    $("#cj").hide();
    $("#com").hide();
    $('#cj').animate({
          right: '200px'
        })
    $.when( $("#cj").fadeIn(1500) ).done(function() {
        $("#com").fadeIn(4000);
    });
});
