// Load wetfish basic
var $ = require('wetfish-basic');

// Load other stuff
var extend = require('extend');
var helper = require('./helper');
var TextMagick = require('../plugins/textmagick');

// Helper functions for creating elements on the page
var create =
{
    element: function(element, options)
    {
        // Does the element already exist on the page?
        if(!document.contains(element))
        {
            // Add the new element to the workspace
            $('.workspace').el[0].appendChild(element);
        }

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

        if(options.layer)
        {
            options.layer = parseInt(options.layer);

            // Update the global layer count if this object is higher than it
            if(options.layer > helper.layers)
            {
                helper.layers = options.layer;
            }

            $(element).style({'z-index': options.layer});
        }
        else
        {
            // Make sure it's on the top layer
            $(element).style({'z-index': helper.layers + 1});
        }

        // If a specific position was passed
        if(options.position)
        {
            $(element).transform('translate', options.position.left + 'px', options.position.top + 'px');
        }
        // Otherwise default to centering the new element in the middle of the page
        else
        {
            $(element).transform('translate', ($(window).width() / 2 - $(element).width() / 2) + 'px', ($(window).height() / 2 - $(element).height() / 2) + 'px');
        }

        // If any transform options were passed
        if(options.transform)
        {
            $(element).transform(options.transform);
        }

        // Duration option will remove the element after a certain amount of time
        if(options.duration)
        {
            setTimeout(function()
            {
                $(element).remove();
            }, options.duration);
        }
 
        $(element).addClass('content');
        $('.workspace').trigger('content-created', element);
    },

    image: function(options)
    {
        var image;
        var defaults =
        {
            type: 'image',
        };

        // Deep combine user given options with defaults
        options = extend(true, defaults, options);

        // Check if any old save data was provided in the options
        if(options.id && options.saved)
        {
            var id = options.id;
            var saved = JSON.parse(options.saved);
            delete options.id;
            delete options.saved;

            // Combine old save data with new form data
            options = extend(true, saved, options);

            // And now check if the saved element ID actually exists on the page
            if($('#' + id).el.length)
            {
                image = $('#' + id).el[0];
            }
        }

        image = image || document.createElement('img');
        $(image).attr('src', options.url);

        create.element(image, options);
        return {element: image, options: options};
    },

    audio: function(options)
    {
        var audio;
        var defaults =
        {
            type: 'audio',
            volume: 1,
            autoplay: true,
            loop: true,
            controls: true,
        };

        // Deep combine user given options with defaults
        options = extend(true, defaults, options);

        // Check if any old save data was provided in the options
        if(options.id && options.saved)
        {
            var id = options.id;
            var saved = JSON.parse(options.saved);
            delete options.id;
            delete options.saved;

            // Combine old save data with new form data
            options = extend(true, saved, options);

            // And now check if the saved element ID actually exists on the page
            if($('#' + id).el.length)
            {
                audio = $('#' + id).el[0];
            }
        }


        audio = audio || document.createElement('audio');
        $(audio).attr('src', options.url);

        create.element(audio, options);
        return {element: audio, options: options};
    },

    video: function(options)
    {
        var video;
        var defaults =
        {
            type: 'video',
            volume: 1,
            autoplay: true,
            loop: true,
            controls: true,
        };

        // Deep combine user given options with defaults
        options = extend(true, defaults, options);

        // Check if any old save data was provided in the options
        if(options.id && options.saved)
        {
            var id = options.id;
            var saved = JSON.parse(options.saved);
            delete options.id;
            delete options.saved;

            // Combine old save data with new form data
            options = extend(true, saved, options);

            // And now check if the saved element ID actually exists on the page
            if($('#' + id).el.length)
            {
                video = $('#' + id).el[0];
            }
        }

        video = video || document.createElement('video');
        $(video).attr('src', options.url);

        create.element(video, options);
        return {element: video, options: options};
    },

    text: function(options)
    {
        var text;
        var element;
        var defaults =
        {
            type: 'text',
            centered: true,
        };

        // Deep combine user given options with defaults
        options = extend(true, defaults, options);

        // Check if any old save data was provided in the options
        if(options.id && options.saved)
        {
            var id = options.id;
            var saved = JSON.parse(options.saved);
            delete options.id;
            delete options.saved;

            // Combine old save data with new form data
            options = extend(true, saved, options);

            // And now check if the saved element ID actually exists on the page
            if($('#' + id).el.length)
            {
                element = $('#' + id).el[0];
                text = element.textmagick;

                text.setText(options.text);
                text.setOptions(options);
            }
        }
        else
        {
            text = new TextMagick(options.text, options);
            element = text.getElement();

            create.element(element, options);
        }

        text.resize();

        return {element: element, text: text, options: options};
    },

    background: function(options)
    {
        if(options.background)
        {
            $('body').style({'background': options.background});
        }

        if(options.image)
        {
            $('body').style({'background-image': 'url("'+options.image+'")'});
        }

        if(options.repeat)
        {
            $('body').style({'background-repeat': options.repeat});
        }

        if(options.position)
        {
            $('body').style({'background-position': options.position});
        }
    }
};

module.exports = create;
