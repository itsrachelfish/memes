// Load wetfish basic
var $ = require('wetfish-basic');
require('dragondrop');

// Load custom modules
var overlay = require('./overlay');

var presets =
{
    // Object which saves which presets have been initialized
    // Presets do not bind any events until they are actually used
    initialized: {},
    
    // Global event bindings for presets when the page is loaded
    init: function()
    {
        $('.presets button').on('click', function()
        {
            var preset = this.className;

            // If there is a handler object for this preset
            if(presets[preset] !== undefined)
            {
                // Has this preset been initialized?
                if(presets.initialized[preset] === undefined)
                {
                    presets[preset].init();
                    presets.initialized[preset] = true;
                }

                // Now call the create method
                presets[preset].create();
            }
        });
    },

    airhorn:
    {
        init: function()
        {
            // When an airhorn is clicked
            $('body').on('mousedown', '.workspace .airhorn', function()
            {
                // Play the airhorn sound
                var audio = $('.preload .airhorn').clone();
                $('.workspace').el[0].appendChild(audio);

                audio.pause();
                audio.currentTime = 0;
                audio.play();

                // Make the airhorn jiggle
                var airhorn = this;
                $(airhorn).addClass('active');

                // Always remove audio after it's finished playing
                setTimeout(function()
                {
                    $(audio).remove();
                }, 1750)

                if(presets.airhorn.timeout)
                {
                    clearTimeout(presets.airhorn.timeout);
                }

                // Wait for last timeout before removing the active class
                presets.airhorn.timeout = setTimeout(function()
                {
                    $(airhorn).removeClass('active');
                }, 1750)

            });
        },

        // Add an airhorn to the page
        create: function()
        {
            // Create the airhorn element
            var image = document.createElement('div');
            $(image).addClass('airhorn');

            // Add it to the page
            $('.workspace').el[0].appendChild(image);

            // Now center it it the middle of the screen
            var options =
            {
                'top': ($(window).height() / 2 - $(image).height() / 2) + 'px',
                'left': ($(window).width() / 2 - $(image).width() / 2) + 'px',
            };

            $(image).style(options);
            $(image).dragondrop();

            overlay.close('.presets');
        },
    }
};

module.exports = presets;
