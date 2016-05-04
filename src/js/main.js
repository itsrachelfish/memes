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
    $('.overlays').on('click', function()
    {
        $('body').removeClass('overlay-open');
        $('.overlay').removeClass('open');
    });

    $('.overlay').on('click', function(event)
    {
        event.stopPropagation();
    });
    
    $('.help').on('click', function()
    {
        $('body').addClass('overlay-open');
        $('.overlay.help').addClass('open');
    });
    
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
                var random = helper.random(1, 2);
                $(image).attr('src', 'img/explosion-' + random + '.gif');

                // The explosion gifs are different lengths
                var duration = (random == 1) ? 750 : 1100;
                
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
