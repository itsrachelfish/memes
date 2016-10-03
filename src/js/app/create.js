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
            $('.workspace').trigger('content-created', element);
        }

        // Check if audio / video specific options need to be added
        if(options.type == 'audio' || options.type == 'video')
        {
            $(element).find('.element').prop('volume', options.volume);
            $(element).find('.element').attr('loop', options.loop);
        }

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

        // If any transform options were passed
        if(options.transform)
        {
            $(element).transform(options.transform);
        }
        // Otherwise default to centering the new element in the middle of the page
        else
        {
            $(element).transform('translate', ($(window).width() / 2 - $(element).width() / 2) + 'px', ($(window).height() / 2 - $(element).height() / 2) + 'px');
        }

        // Duration option will remove the element after a certain amount of time
        if(options.duration)
        {
            setTimeout(function()
            {
                $(element).remove();
            }, options.duration);
        }

        // Custom classes
        if(options.class)
        {
            $(element).addClass(options.class);
        }
 
        $(element).addClass('content');
        $('.workspace').trigger('content-updated', element);
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

        if(audio === undefined)
        {
            audio = $('.audio-wrap.hidden').clone();
            $(audio).removeClass('hidden');
        }

        // Add a default value for the audio description
        options.title = options.title || 'untitled audio';

        $(audio).find('.title').text(options.title);
        $(audio).find('.element').attr('src', options.url);

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

        if(video === undefined)
        {
            video = $('.video-wrap.hidden').clone();
            $(video).removeClass('hidden');
        }

        $(video).find('.element').attr('src', options.url);

        create.element(video, options);
        return {element: video, options: options};
    },

    headline: function(options)
    {
        var text;
        var element;
        var defaults =
        {
            type: 'headline',
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
                headline = element.textmagick;

                headline.setText(options.text);
                headline.setOptions(options);
            }
        }
        else
        {
            headline = new TextMagick(options.text, options);
            element = headline.getElement();

            create.element(element, options);
        }

        headline.resize();

        return {element: element, options: options};
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
                text = $('#' + id).el[0];
            }
        }

        var style =
        {
            'font-family': options.font || 'inherit',
            'font-size': options.size + 'pt' || '12pt',
            'line-height': options.height + 'em' || '1em',
            'color': options.color || 'black',
        };

        text = text || document.createElement('div');
        $(text).addClass('text');
        $(text).text(options.text);
        $(text).style(style);

        create.element(text, options);
        return {element: text, options: options};
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
