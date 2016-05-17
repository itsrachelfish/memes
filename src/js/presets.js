// Load wetfish basic
var $ = require('wetfish-basic');

// Load custom modules
var overlay = require('./overlay');
var pool = require('./pool');
var helper = require('./helper');
var element = require('./element');
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
        create: function()
        {
            var airhorn = document.createElement('div');
            $(airhorn).addClass('airhorn');

            var options =
            {
                type: 'preset',
                preset: 'airhorn',
                centered: true
            };

            element.addNew(airhorn, options);
            return {element: airhorn, options: options};
        },
    },

    image:
    {
        create: function(image)
        {
            if($(image).data('src'))
            {
                return element.addImage({url: 'img/' + $(image).data('src')});
            }
        }
    },

    sound:
    {
        create: function(sound)
        {
            if($(sound).data('src'))
            {
                return element.addAudio({url: 'audio/' + $(sound).data('src')});
            }
        }
    },

    video:
    {
        create: function(video)
        {
            if($(video).data('src'))
            {
                return element.addVideo({url: 'video/' + $(video).data('src')});
            }
        }
    },
};

module.exports = presets;
