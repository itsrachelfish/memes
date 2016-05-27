// Load wetfish basic
var $ = require('wetfish-basic');

// Load other stuff
var extend = require('extend');

var overlay = require('../ui/overlay');
var pool = require('../plugins/pool');

var helper = require('./helper');
var create = require('./create');
var storage = require('./storage');


var presets =
{
    // Object which saves which presets have been initialized
    // Presets do not bind any events until they are actually used
    initialized: {},

    airhorn:
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
                // Prevent default behavior when in tool mode
                if($('body').hasClass('tool-mode'))
                {
                    return;
                }

                // Play the airhorn sound
                pool.play('airhorn');

                // Make the airhorn jiggle
                var airhorn = this;
                $(airhorn).addClass('active');

                // Does this airhorn have a unique ID? If not, generate one
                var id = $(airhorn).attr('id') || helper.randomString();
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
        create: function(button, options)
        {
            var airhorn = document.createElement('div');
            $(airhorn).addClass('airhorn');

            var defaults =
            {
                type: 'preset',
                preset: 'airhorn',
                centered: true
            };

            // Deep combine user given options with defaults
            options = extend(true, defaults, options);

            create.element(airhorn, options);
            return {element: airhorn, options: options};
        },
    },

    image:
    {
        create: function(button)
        {
            if($(image).data('src'))
            {
                return create.image({url: 'img/' + $(button).data('src')});
            }
        }
    },

    sound:
    {
        create: function(button)
        {
            if($(sound).data('src'))
            {
                return create.audio({url: 'audio/' + $(button).data('src')});
            }
        }
    },

    video:
    {
        create: function(button)
        {
            if($(video).data('src'))
            {
                return create.video({url: 'video/' + $(button).data('src')});
            }
        }
    },
};

module.exports = presets;
