'use strict';

// smooth scrolling
$('a').click(function(){
    $('html, body').animate({
        scrollTop: $( $.attr(this, 'href') ).offset().top
    }, 500);
    return false;
});

// data maps
var map = new Datamap({
    element: document.getElementById('map'),
    fills: {
        defaultFill: 'rgba(120, 90, 70, 0.8)',
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
