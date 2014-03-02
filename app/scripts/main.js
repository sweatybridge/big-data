'use strict';

// Scroll the background layers
function parallaxScroll(){
    var scrolled = $(window).scrollTop();
    $('#parallax-bg1').css('top',(0-(scrolled*0.25))+'px');
    $('#parallax-bg2').css('top',(0-(scrolled*0.5))+'px');
    $('#parallax-bg3').css('top',(0-(scrolled*0.75))+'px');
}

// Set navigation dots to an active state as the user scrolls 
function redrawDotNav(){
    var half = $(window).height() / 2;
    var section1Top =  0;
    // The top of each section is offset by half the distance to the previous section.
    var section2Top =  $('#about').offset().top - half;
    var section3Top =  $('#features').offset().top - half;
    var section4Top =  $('#demo1').offset().top - half;
    var section5Top =  $('#demo2').offset().top - half;
    var section6Top =  $('#demo3').offset().top - half;
    var section7Top =  $('#conclusion').offset().top - half;
    $('nav#primary a').removeClass('active');
    if($(document).scrollTop() >= section1Top && $(document).scrollTop() < section2Top){
        $('nav#primary a.home').addClass('active');
    } else if ($(document).scrollTop() >= section2Top && $(document).scrollTop() < section3Top){
        $('nav#primary a.about').addClass('active');
    } else if ($(document).scrollTop() >= section3Top && $(document).scrollTop() < section4Top){
        $('nav#primary a.features').addClass('active');
    } else if ($(document).scrollTop() >= section4Top && $(document).scrollTop() < section5Top){
        $('nav#primary a.demo1').addClass('active');
    } else if ($(document).scrollTop() >= section5Top && $(document).scrollTop() < section6Top){
        $('nav#primary a.demo2').addClass('active');
    } else if ($(document).scrollTop() >= section6Top && $(document).scrollTop() < section7Top){
        $('nav#primary a.demo3').addClass('active');
    } else if ($(document).scrollTop() >= section7Top){
        $('nav#primary a.conclusion').addClass('active');
    }
}

$(document).ready(function() {
    redrawDotNav();
    // Scroll event handler 
    $(window).bind('scroll', function() {
        parallaxScroll();
        redrawDotNav();
    });

    // Show/hide dot lav labels on hover
    $('nav#primary a').hover(function() {
        $(this).prev('h1').show();
    }, function() {
        $(this).prev('h1').hide();
    });

    // smooth scrolling
    $('a').click(function() {
        $('html, body').animate({
            scrollTop: $( $.attr(this, 'href') ).offset().top
        }, 500, function() {
            parallaxScroll(); // Callback is required for iOS
        });
        return false;
    });
});

// data maps
var map = new Datamap({
    element: document.getElementById('map'),
    fills: {
        defaultFill: 'rgba(60, 50, 60, 0.6)',
    },
    geographyConfig: {
        borderColor: 'rgba(100, 100, 100, 0.6)',
        highlightFillColor: 'rgba(60, 50, 60, 0.8)',
        highlightBorderColor: 'rgba(100, 100, 100, 0.8)',
        popupOnHover: false
    }
});

map.arc([{
    origin: {
        latitude: 40.639722,
        longitude: -73.778889
    },
    destination: {
        latitude: 37.618889,
        longitude: -122.375
    }
}], {
    strokeWidth: 1,
    arcSharpness: 1.4
});

function highlight() {
    console.log('highlight');
    var ps = d3.selectAll('.datamaps-subunit')[0];
    var i = Math.round(Math.random() * ps.length);
    d3.select(ps[i])
    .style('fill', '#646464')
    .transition()
    .duration(5000)
    .style('fill', '#3c323c')
    .style('opacity', 0.6);
}

(function loop() {
    var rand = Math.round(Math.random() * 500) + 100;
    setTimeout(function() {
        highlight();
        loop();
    }, rand);
}());
