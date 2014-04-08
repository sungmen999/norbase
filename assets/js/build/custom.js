$(document).ready(function() {
    /*
    $('.first').waypoint(function(direction) {
        $('.site-header').toggleClass('sticky');
        $(this).toggleClass('sticky');
    }, {offset: 90});
    */
    $('h1, h2, h3, h4, h5, h6').countLines({'increments':[2]});

    $('input').iCheck();

    $('select').fancySelect();
});