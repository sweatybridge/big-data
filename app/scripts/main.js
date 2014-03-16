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
    var section4Top =  $('#demo').offset().top - half;
    var section5Top =  $('#conclusion').offset().top - half;
    $('nav#primary a').removeClass('active');
    if($(document).scrollTop() >= section1Top && $(document).scrollTop() < section2Top){
        $('nav#primary a.home').addClass('active');
    } else if ($(document).scrollTop() >= section2Top && $(document).scrollTop() < section3Top){
        $('nav#primary a.about').addClass('active');
    } else if ($(document).scrollTop() >= section3Top && $(document).scrollTop() < section4Top){
        $('nav#primary a.features').addClass('active');
    } else if ($(document).scrollTop() >= section4Top && $(document).scrollTop() < section5Top){
        $('nav#primary a.demo').addClass('active');
    } else if ($(document).scrollTop() >= section5Top){
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
    $('a:not(.carousel-control, #pigControl)').click(function() {
        $('html, body').animate({
            scrollTop: $( $.attr(this, 'href') ).offset().top
        }, 500, function() {
            parallaxScroll(); // Callback is required for iOS
        });
        return false;
    });

    // attach pig audio control
    $('#pigControl').click(function() {
        $('#pigAudio')[0].play();
        $('#pigModal').modal('toggle');
        return false;
    });
});

// data maps
var map = new Datamap({
    element: document.getElementById('map'),
    fills: {
        defaultFill: 'rgba(232, 172, 137, 0.8)',
    },
    geographyConfig: {
        borderColor: 'rgba(100, 100, 100, 0.6)',
        highlightFillColor: 'rgba(246, 157, 30, 0.5)',
        highlightBorderColor: 'rgba(100, 100, 100, 0.8)',
        popupOnHover: false
    }
});

var wbc;

function highlight() {
    console.log('highlight');
    // var ps = d3.selectAll('.datamaps-subunit')[0];
    var i = Math.floor(Math.random() * wbc.length);
    var c = wbc[i];
    d3.select('.datamaps-subunit.' + c.id)
    .style('fill', '#F6A71E')
    .transition()
    .duration(5000)
    .style('fill', '#e8ac89')
    .style('opacity', 0.8);

    var j = Math.floor(Math.random() * wbc.length);
    var d = wbc[j];
    d3.select('.datamaps-subunit.' + d.id)
    .style('fill', '#F6A71E')
    .transition()
    .duration(5000)
    .style('fill', '#e8ac89')
    .style('opacity', 0.8);

    var pos = map.projection([c.longitude, c.latitude]);
    var pos2 = map.projection([wbc[j].longitude, wbc[j].latitude]);
    fireworks.push( new Firework( pos2[0], pos2[1], pos[0], pos[1] ) );
    fireworks.push( new Firework( pos[0], pos[1], pos2[0], pos2[1] ) );
}

function wbcloop() {
    var rand = Math.round(Math.random() * 500) + 100;
    setTimeout(function() {
        highlight();
        wbcloop();
    }, rand);
}

$.getJSON('wbc.json', function (json) {
    wbc = json;
    wbcloop();
});
