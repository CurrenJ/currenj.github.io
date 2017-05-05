$(document).ready(function() {   
    $("#cj").hide();
    $("#com").hide();
    
    $.when( $("#cj").fadeIn(1500) ).done(function() {
        $('#cj').animate({
          right: '200px'
        });
        $("#com").fadeIn(4000);
    });
});
