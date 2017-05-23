$(document).ready(function() {   
    $("#cj").hide();
    $("#com").css('opacity','0')
    $.when( $("#cj").fadeIn(1500) ).done(function() {
        $("#com").fadeTo(4000, 1);
        $("#com").animate("left", "-10vw");
    });
});

jQuery("tr").click(function(){
	jQuery(this).animate({
			backgroundColor: "#94fc8a"
	}, 1500 );
});
