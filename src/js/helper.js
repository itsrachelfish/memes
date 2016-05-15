// Load wetfish basic
var $ = require('wetfish-basic');
require('dragondrop');

// Load other stuff
var extend = require('extend');
var TextMagick = require('./textmagick');

// Miscellaneous helper functions
var helper =
{
    // Used to stack elements ontop of eachother as you move them
    layers: 0,

    addElement: function(element, options)
    {
        // Check the type of the element
        var type = element.tagName.toLowerCase();

        // Add audio / video specific options
        if(type == 'audio' || type == 'video')
        {
            $(video).attr('volume', options.volume);
            $(video).attr('autoplay', options.autoplay);
            $(video).attr('loop', options.loop);
            $(video).attr('controls', options.controls);
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
        });
    },

    addImage: function(options)
    {
        var defaults =
        {
            centered: true,
        };

        // Deep combine user given options with defaults
        options = extend(true, defaults, options);

        var image = document.createElement('img');
        $(image).attr('src', options.src);

        helper.addElement(image, options);

        return image;
    },

    addSound: function(options)
    {
        var defaults =
        {
            volume: 1,
            autoplay: true,
            loop: true,
            controls: true,
            centered: true,
        };

        // Deep combine user given options with defaults
        options = extend(true, defaults, options);

        var sound = document.createElement('audio');
        $(sound).attr('src', options.src);

        helper.addElement(sound, {'centered': true});

        return sound;
    },

    addVideo: function(options)
    {
        var defaults =
        {
            volume: 1,
            autoplay: true,
            loop: true,
            controls: true,
            centered: true,
        };

        // Deep combine user given options with defaults
        options = extend(true, defaults, options);

        var video = document.createElement('video');
        $(video).attr('src', options.src);

        helper.addElement(video, options);

        return video;
    },

    addText: function(options)
    {
        var defaults =
        {
            centered: true,
        };

        // Deep combine user given options with defaults
        options = extend(true, defaults, options);

        var text = new TextMagick(options.text, options);
        var element = text.getElement();

        helper.addElement(element, options);
        text.resize();

        return text;
    },

    random: function(min, max)
    {
        return Math.round(Math.random() * (max - min)) + min;
    },

    serialize: function(form)
    {
        var input = {};

        $(form).find('input, textarea, select').each(function()
        {
            if($(this).attr('type') == "submit")
            {
                return;
            }

            if($(this).attr('type') == 'checkbox')
            {
                if($(this).prop('checked'))
                {
                    input[$(this).attr('name')] = true;
                }
                else
                {
                    input[$(this).attr('name')] = false;
                }

                return;
            }

            input[$(this).attr('name')] = $(this).value();

        });

        return input;
    },

    validate: function(input)
    {
        if(!input.url)
        {
            alert("ayyyyyyyy where's the url?");
            return false;
        }

        return true;
    }
};


module.exports = helper;
