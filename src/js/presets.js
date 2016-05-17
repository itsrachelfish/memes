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
    
    // Global event bindings for presets when the page is loaded
    init: function()
    {
        $('.presets button').on('click', function()
        {
            var preset = $(this).data('preset');

            // If there is a handler object for this preset
            if(presets[preset] !== undefined)
            {
                // Does this preset need to be initialized?
                if(typeof presets[preset].init == "function")
                {
                    // Has it been?
                    if(presets.initialized[preset] === undefined)
                    {
                        presets[preset].init(this);
                        presets.initialized[preset] = true;
                    }
                }

                // Now call the create method
                presets[preset].create(this);

                // And close the presets menu
                overlay.close('.presets');
            }
        });
    },

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
            storage.save(airhorn, options);
        },
    },

/*
    image:
    {
        create: function(element)
        {
            if($(element).data('src'))
            {
                var image = element.addImage({url: 'img/' + $(element).data('src')});
                storage.save(image.element, image.options);
            }
        }
    },

    sound:
    {
        create: function(element)
        {
            if($(element).data('src'))
            {
                var audio = element.addAudio({url: 'audio/' + $(element).data('src')});
                storage.save(audio.element, audio.options);
            }
        }
    },

    video:
    {
        create: function(element)
        {
            if($(element).data('src'))
            {
                var video = element.addVideo({url: 'video/' + $(element).data('src')});
                storage.save(video.element, video.options);
            }
        }
    },
*/
};

module.exports = presets;
