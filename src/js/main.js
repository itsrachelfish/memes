// Load wetfish basic
var $ = require('wetfish-basic');
require('dragondrop');

// Load custom modules
var Webcam = require('./webcam');
var helper = require('./helper');
var menu = require('./menu');
var overlay = require('./overlay');

// A map of currently pressed keys
var pressed = {};

// Global timeout cache
var timeout =
{
    // The durations of the different explosion animations
    explosion:
    {
        1: 1600,
        2: 1200,
        3: 860,
        4: 1060,
        5: 1600,
        6: 900,
        7: 1090
    }
};

$(document).ready(function()
{
    menu.init();
    overlay.init();

    // Hitmarkers
    $('body').on('mousedown', '.workspace', function(event)
    {
        // If left click was pressed
        if(event.buttons == 1)
        {
            // If the user is holding control while clicking
            if(pressed.control)
            {
                var audio = $('.preload .hitmarker').clone();
                $(audio).attr('preload', false);

                var image = document.createElement('img');
                $(image).style({'top': event.clientY + 'px', 'left': event.clientX + 'px'});
                $(image).addClass('hitmarker');
                $(image).attr('src', 'img/hitmarker.png');

                $('.workspace').el[0].appendChild(audio);
                $('.workspace').el[0].appendChild(image);

                audio.pause();
                audio.currentTime = 0;
                audio.play();

                // Remove the sound quickly so the browser queue doesn't get filled up
                setTimeout(function()
                {
                    $(audio).remove();
                }, 50)

                // Remove the image a bit later
                setTimeout(function()
                {
                    $(image).remove();
                }, 500);

            }
        }
    });

    // Deleting things
    $('body').on('mousedown', '.workspace *', function(event)
    {        
        // If right click was pressed
        if(event.buttons == 2)
        {
            // If the user is holding control while deleting an image
            if(pressed.control)
            {
                // Save the size and position of the current element
                var size = $(this).size();
                var position = $(this).position();

                // Increase the size of the explosion a little bit
                size.width += 50;
                size.height += 50;
                position.top -= 25;
                position.left -= 25;

                // Create an image to overlay the explosion over the current element
                var image = document.createElement('img');
                var options =
                {
                    'position': 'absolute',
                    'top': position.top + 'px',
                    'left': position.left + 'px',
                    'width': size.width + 'px',
                    'height': size.height + 'px',
                };

                $(image).style(options);
                $(image).addClass('explosion');

                // Generate a random explosion image
                var random = helper.random(1, 7);
                $(image).attr('src', 'img/explosion-' + random + '.gif');
                
                // EXPLODE!
                $('.workspace').el[0].appendChild(image);

                $('audio.explosion').el[0].pause();
                $('audio.explosion').el[0].currentTime = 0;
                $('audio.explosion').el[0].play();

                // Remove the original element, if it's not an explosion
                if(!$(this).hasClass('explosion'))
                {
                    $(this).remove();
                }

                // Remove the explosion after the animation is finished
                setTimeout(function()
                {
                    $(image).remove();
                }, timeout.explosion[random])
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

        // Toggle the menu when pressing escape
        if(key == 'escape')
        {
            $('.menu').toggle('hidden');
        }
    });

    $('body').on('keyup', function(event)
    {
        var key = event.key.toLowerCase();
        delete pressed[key];
    });
});
