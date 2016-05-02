// Load wetfish basic
var $ = require('wetfish-basic');
require('dragondrop');

// Load custom modules
var Webcam = require('./webcam');
var helper = require('./helper');

// A map of currently pressed keys
var pressed = {};

// Global timeout cache
var timeout = {};

// Global webcam object
var webcam;


$(document).ready(function()
{
    $('.start-webcam').on('click', function()
    {
        $(this).addClass('hidden');
        $('.stop-webcam').removeClass('hidden');
        
        webcam = new Webcam('.webcam');
    });

    $('.stop-webcam').on('click', function()
    {
        $(this).addClass('hidden');
        $('.start-webcam').removeClass('hidden');

        webcam.stop();
        $('.webcam').attr('src', '');
    });

    $('.add-image').on('click', function()
    {
        var src = prompt("Enter an image URL");
        var image = document.createElement('img');

        $(image).attr('src', src);
        $(image).dragondrop();

        $('.workspace').el[0].appendChild(image);
    });

    $('.add-sound').on('click', function()
    {
        var src = prompt("Enter a sound URL");
        var sound = document.createElement('audio');

        $(sound).attr('src', src).prop('autoplay', true).prop('controls', true);
        $(sound).dragondrop();

        $('.workspace').el[0].appendChild(sound);
    });

    $('.add-video').on('click', function()
    {
        var src = prompt("Enter a video URL");
        var video = document.createElement('video');

        $(video).attr('src', src).prop('autoplay', true).prop('controls', true);
        $(video).dragondrop();

        $('.workspace').el[0].appendChild(video);
    });

    $('body').on('mousedown', '.workspace *', function(event)
    {
        // If right click was pressed
        if(event.buttons == 2)
        {
            // If the user is holding control while deleting an image
            if(pressed.control)
            {
                // Save the current size
                var size = $(this).size();
                $(this).style({'width': size.width + 'px', 'height': size.height + 'px'});

                // Generate a random explosion
                var random = helper.random(1, 2);
                var img = 'img/explosion-' + random + '.gif';
                var audio = 'audio/explosion.mp3';

                // The explosion images are different lengths
                var duration = (random == 1) ? 750 : 1100;
                
                // EXPLODE!
                $(this).attr('src', img);

                $('.explosion').el[0].pause();
                $('.explosion').el[0].currentTime = 0;
                $('.explosion').el[0].play();

                var image = this;

                if(timeout.explosion)
                {
                    clearTimeout(timeout.explosion);
                }

                timeout.explosion = setTimeout(function()
                {
                    $(image).remove();
                }, duration)
            }
            else
            {
                // Otherwise just remove it
                $(this).remove();
            }
        }
    });

    $('body').on('contextmenu', function(event)
    {
        event.preventDefault();
    });

    $('body').on('keydown', function(event)
    {
        var key = event.key.toLowerCase();
        pressed[key] = true;
    });

    $('body').on('keyup', function(event)
    {
        var key = event.key.toLowerCase();
        delete pressed[key];
    });
});
