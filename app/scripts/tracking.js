'use strict';

$(document).ready(function() {
	// event tracking
	$('#pigControl').click(function() {
		ga('send', 'event', 'button', 'click', 'Pig Sound');
	});
	$('#about').click(function() {
		ga('send', 'event', 'button', 'click', 'Landing Button');
	});
	$('nav').click(function() {
		ga('send', 'event', 'button', 'click', 'Navigation Bar');
	});
	$('#ga-s1').click(function() {
		ga('send', 'event', 'button', 'click', 'Step 1');
	});
	$('#ga-s2').click(function() {
		ga('send', 'event', 'button', 'click', 'Step 2');
	});
	$('#ga-s3').click(function() {
		ga('send', 'event', 'button', 'click', 'Step 3');
	});
	$('#ga-s4').click(function() {
		ga('send', 'event', 'button', 'click', 'Step 4');
	});
	$('#ga-ref').click(function() {
		ga('send', 'event', 'button', 'click', 'References');
	});
});