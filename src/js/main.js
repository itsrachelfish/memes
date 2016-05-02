// Load wetfish basic
var $ = require('wetfish-basic');
require('dragondrop');

// Load custom modules
var Webcam = require('./webcam');
var helper = require('./helper');

// A map of currently pressed keys
var pressed = {};

$(document).ready(function()
{
    $('.start-webcam').on('click', function()
    {
        var webcam = new Webcam('.webcam');
    });

    $('.add-image').on('click', function()
    {
        var src = prompt("Enter an image URL");
        var image = document.createElement('img');

        $(image).attr('src', src);
        $(image).dragondrop();

        $('.workspace').el[0].appendChild(image);
    });

    $('body').on('mousedown', 'img', function(event)
    {
        // If right click was pressed
        if(event.buttons == 2)
        {
            // If the user is holding control while deleting an image
            if(pressed.control)
            {
                // Generate a random explosion
                var random = helper.random(1, 2);
                var img = 'img/explosion-' + random + '.gif';
                var audio = 'audio/explosion.mp3';

                // The explosion images are different lengths
                var timeout = (random == 1) ? 750 : 1100;
                
                // EXPLODE!
                $(this).attr('src', img);

                $('.explosion').el[0].pause();
                $('.explosion').el[0].currentTime = 0;
                $('.explosion').el[0].play();

                var image = this;

                setTimeout(function()
                {
                    $(image).remove();
                }, timeout)
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
