// Load wetfish basic
var $ = require('wetfish-basic');
require('dragondrop');

// Load other stuff
var extend = require('extend');
var helper = require('./helper');
var TextMagick = require('../plugins/textmagick');

// Helper functions for creating elements on the page
var create =
{
    element: function(element, options)
    {
        // Check if audio / video specific options need to be added
        if(options.type == 'audio' || options.type == 'video')
        {
            $(element).attr('volume', options.volume);
            $(element).attr('autoplay', options.autoplay);
            $(element).attr('loop', options.loop);
            $(element).attr('controls', options.controls);
        }

        // Add license information if provided
        $(element).data('desc', options.desc);
        $(element).data('license', options.license);

        // Add the new element to the workspace
        $('.workspace').el[0].appendChild(element);

        // Make sure it's on the top layer
        $(element).style({'z-index': helper.layers + 1});

        // Centered option automatically centers the new element in the middle of the page
        if(options.centered)
        {
            $(element).style({
                'position': 'absolute',
                'left': ($(window).width() / 2 - $(element).width() / 2) + 'px',
                'top': ($(window).height() / 2 - $(element).height() / 2) + 'px',
            });
        }

        // If a specific position was passed
        if(options.position)
        {
            $(element).style({
                'position': 'absolute',
                'left': options.position.left + 'px',
                'top': options.position.top + 'px',
            });
        }

        // Duration option will remove the element after a certain amount of time
        if(options.duration)
        {
            setTimeout(function()
            {
                $(element).remove();
            }, options.duration);
        }

        $(element).dragondrop();

        // Ensure the element being dragged is always on top
        $(element).on('dragstart', function()
        {
            helper.layers++;
            $(this).style({'z-index': helper.layers});

            // Trigger an event on the workspace
            $('.workspace').trigger('start', element);
        });

        $(element).on('dragend', function()
        {
            // Trigger an event on the workspace
            $('.workspace').trigger('dragend', element);
        });
    },

    image: function(options)
    {
        var defaults =
        {
            type: 'image',
            centered: true,
        };

        // Deep combine user given options with defaults
        options = extend(true, defaults, options);

        var image = document.createElement('img');
        $(image).attr('src', options.url);

        create.element(image, options);
        return {element: image, options: options};
    },

    audio: function(options)
    {
        var defaults =
        {
            type: 'audio',
            volume: 1,
            autoplay: true,
            loop: true,
            controls: true,
            centered: true,
        };

        // Deep combine user given options with defaults
        options = extend(true, defaults, options);

        var sound = document.createElement('audio');
        $(sound).attr('src', options.url);

        create.element(sound, options);
        return {element: sound, options: options};
    },

    video: function(options)
    {
        var defaults =
        {
            type: 'video',
            volume: 1,
            autoplay: true,
            loop: true,
            controls: true,
            centered: true,
        };

        // Deep combine user given options with defaults
        options = extend(true, defaults, options);

        var video = document.createElement('video');
        $(video).attr('src', options.url);

        create.element(video, options);
        return {element: video, options: options};
    },

    text: function(options)
    {
        var defaults =
        {
            type: 'text',
            centered: true,
        };

        // Deep combine user given options with defaults
        options = extend(true, defaults, options);

        var text = new TextMagick(options.text, options);
        var element = text.getElement();

        create.element(element, options);
        text.resize();

        return {element: element, text: text, options: options};
    },
};

module.exports = create;
