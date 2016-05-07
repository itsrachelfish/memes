// Load wetfish basic
var $ = require('wetfish-basic');
require('dragondrop');

// Load custom modules
var overlay = require('./overlay');
var pool = require('./pool');

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
                // Does this preset need to be initialized?
                if(typeof presets[preset].init == "function")
                {
                    // Has it been?
                    if(presets.initialized[preset] === undefined)
                    {
                        presets[preset].init();
                        presets.initialized[preset] = true;
                    }
                }

                // Now call the create method
                presets[preset].create();

                // And close the presets menu
                overlay.close('.presets');
            }
        });
    },

    'airhorn':
    {
        // Object for airhorn timeouts
        timeout: {},

        init: function()
        {
            var airhorn = $('.preload .airhorn').el[0];
            pool.init(airhorn, 'airhorn', 12);
            
            // When an airhorn is clicked
            $('body').on('mousedown', '.workspace .airhorn', function()
            {
                // Play the airhorn sound
                pool.play('airhorn');

                // Make the airhorn jiggle
                var airhorn = this;
                $(airhorn).addClass('active');

                // Does this airhorn have a unique ID? If not, generate one
                var id = $(airhorn).attr('id') || Math.random().toString(36).slice(2);
                $(airhorn).attr('id', id);

                // Clear any previously defined timeouts for this airhorn
                if(presets.airhorn.timeout[id])
                {
                    clearTimeout(presets.airhorn.timeout[id]);
                }

                // Set a timeout to remove the active class based on the airhorn's unique ID
                presets.airhorn.timeout[id] = setTimeout(function()
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
        },
    },

    'laughing-man':
    {
        create: function()
        {
            var image = document.createElement('div');
            $(image).addClass('laughing-man');
            $('.workspace').el[0].appendChild(image);

            // Now center it it the middle of the screen
            var options =
            {
                'top': ($(window).height() / 2 - $(image).height() / 2) + 'px',
                'left': ($(window).width() / 2 - $(image).width() / 2) + 'px',
            };

            $(image).style(options);
            $(image).dragondrop();
        }
    },

    'cum':
    {
        create: function()
        {
            var image = document.createElement('div');
            $(image).addClass('cum');
            $('.workspace').el[0].appendChild(image);

            // Now center it it the middle of the screen
            var options =
            {
                'top': ($(window).height() / 2 - $(image).height() / 2) + 'px',
                'left': ($(window).width() / 2 - $(image).width() / 2) + 'px',
            };

            $(image).style(options);
            $(image).dragondrop();
        }
    }
};

module.exports = presets;
