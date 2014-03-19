'use strict';

// data maps
var map, canvas, ctx, cw, ch, hue, wbc;
var fireworks = [];

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
    // initialise variables
    map = new Datamap({
        element: $('#map')[0],
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
    canvas = $('#canvas')[0];
    ctx = canvas.getContext('2d');
    // full screen dimensions
    cw = $(window).width();
    ch = $(window).height();
    hue = 120;

    canvas.width = cw;
    canvas.height = ch;

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
        var sound = $('#pigAudio')[0];
        sound.pause();
        sound.currentTime = 0;
        sound.play();
        return false;
    });

    $.getJSON('wbc.json', function (json) {
        wbc = json;
        wbcloop();
        animLoop();
    });
});

// when animating on canvas, it is best to use requestAnimationFrame instead of setTimeout or setInterval
// not supported in all browsers though and sometimes needs a prefix, so we need a shim
window.requestAnimFrame = (function() {
    return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            function( callback ) {
                window.setTimeout( callback, 1000 / 60 );
            };
})();

// get a random number within a range
function random( min, max ) {
    return Math.random() * ( max - min ) + min;
}

// calculate the distance between two points
function calculateDistance( p1x, p1y, p2x, p2y ) {
    var xDistance = p1x - p2x,
            yDistance = p1y - p2y;
    return Math.sqrt( Math.pow( xDistance, 2 ) + Math.pow( yDistance, 2 ) );
}

// create firework
function Firework( sx, sy, tx, ty ) {
    // actual coordinates
    this.x = sx;
    this.y = sy;
    // starting coordinates
    this.sx = sx;
    this.sy = sy;
    // target coordinates
    this.tx = tx;
    this.ty = ty;
    // distance from starting point to target
    this.distanceToTarget = calculateDistance( sx, sy, tx, ty );
    this.distanceTraveled = 0;
    // track the past coordinates of each firework to create a trail effect, increase the coordinate count to create more prominent trails
    this.coordinates = [];
    this.coordinateCount = 20;
    // populate initial coordinate collection with the current coordinates
    while( this.coordinateCount-- ) {
        this.coordinates.push( [ this.x, this.y ] );
    }
    this.angle = Math.atan2( ty - sy, tx - sx );
    this.speed = 10;
    this.acceleration = 1;
    this.brightness = random( 50, 70 );
    // circle target indicator radius
    this.targetRadius = 5;
}

// update firework
Firework.prototype.update = function( index ) {
    // remove last item in coordinates array
    this.coordinates.pop();
    // add current coordinates to the start of the array
    this.coordinates.unshift( [ this.x, this.y ] );
    
    // cycle the circle target indicator radius
    if( this.targetRadius < 8 ) {
        this.targetRadius += 0.3;
    } else {
        this.targetRadius = 1;
    }
    
    // speed up the firework
    this.speed *= this.acceleration;
    
    // get the current velocities based on angle and speed
    var vx = Math.cos( this.angle ) * this.speed,
            vy = Math.sin( this.angle ) * this.speed;
    // how far will the firework have traveled with velocities applied?
    this.distanceTraveled = calculateDistance( this.sx, this.sy, this.x + vx, this.y + vy );
    
    // if the distance traveled, including velocities, is greater than the initial distance to the target, then the target has been reached
    if( this.distanceTraveled >= this.distanceToTarget ) {
        // createParticles( this.tx, this.ty );
        // remove the firework, use the index passed into the update function to determine which to remove
        fireworks.splice( index, 1 );
    } else {
        // target not reached, keep traveling
        this.x += vx;
        this.y += vy;
    }
};

// draw firework
Firework.prototype.draw = function() {
    ctx.beginPath();
    // move to the last tracked coordinate in the set, then draw a line to the current x and y
    ctx.moveTo( this.coordinates[ this.coordinates.length - 1][ 0 ], this.coordinates[ this.coordinates.length - 1][ 1 ] );
    ctx.lineTo( this.x, this.y );
    ctx.strokeStyle = 'hsl(' + hue + ', 100%, ' + this.brightness + '%)';
    ctx.stroke();
    
    ctx.beginPath();
    // draw the target for this firework with a pulsing circle
    ctx.arc( this.tx, this.ty, this.targetRadius, 0, Math.PI * 2 );
    ctx.stroke();
};

function animLoop() {
    // this function will run endlessly with requestAnimationFrame
    window.requestAnimFrame(animLoop);
    
    // increase the hue to get different colored fireworks over time
    hue += 0.5;
    
    // normally, clearRect() would be used to clear the canvas
    // we want to create a trailing effect though
    // setting the composite operation to destination-out will allow us to clear the canvas at a specific opacity, rather than wiping it entirely
    ctx.globalCompositeOperation = 'destination-out';
    // decrease the alpha property to create more prominent trails
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect( 0, 0, cw, ch );
    // change the composite operation back to our main mode
    // lighter creates bright highlight points as the fireworks and particles overlap each other
    ctx.globalCompositeOperation = 'lighter';
    
    // loop over each firework, draw it, update it
    var i = fireworks.length;
    while(i--) {
        fireworks[i].draw();
        fireworks[i].update(i);
    }
}

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
