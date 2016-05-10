// Load wetfish basic
var $ = require('wetfish-basic');
require('dragondrop');

// Load other stuff
var extend = require('extend');

// Miscellaneous helper functions
var helper =
{
    // Used to stack elements ontop of eachother as you move them
    layers: 0,

    addElement: function(element, options)
    {
        $('.workspace').el[0].appendChild(element);

        // Put new element on the top layer
        $(element).style({'z-index': helper.layers + 1});

        if(options.centered)
        {
            $(element).style({
                'position': 'absolute',
                'left': ($(window).width() / 2 - $(element).width() / 2) + 'px',
                'top': ($(window).height() / 2 - $(element).height() / 2) + 'px',
            });
        }

        if(options.duration)
        {
            setTimeout(function()
            {
                $(element).remove();
            }, options.duration);
        }

        $(element).dragondrop();

        $(element).on('dragstart', function()
        {
            // Ensure the element being dragged is always on top
            helper.layers++;
            $(this).style({'z-index': helper.layers});
        });
    },

    addImage: function(src)
    {
        var image = document.createElement('img');
        $(image).attr('src', src);

        helper.addElement(image, {'centered': true});

        return image;
    },

    addSound: function(src, options)
    {
        var defaults =
        {
            volume: 1,
            autoplay: true,
            loop: true,
            controls: true
        };

        // Deep combine user given options with defaults
        options = extend(true, defaults, options);

        var sound = document.createElement('audio');
        $(sound).attr('src', src);
        $(sound).attr('volume', options.volume);
        $(sound).attr('autoplay', options.autoplay);
        $(sound).attr('loop', options.loop);
        $(sound).attr('controls', options.controls);

        helper.addElement(sound, {'centered': true});

        return sound;
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
