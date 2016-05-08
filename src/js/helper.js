// Load wetfish basic
var $ = require('wetfish-basic');
require('dragondrop');

// Miscellaneous helper functions
var helper =
{
    // Used to stack elements ontop of eachother as you move them
    layers: 0,

    addElement: function(element, options)
    {
        $('.workspace').el[0].appendChild(element);

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
            helper.layers++;
            $(this).style({'z-index': helper.layers});
        });
    },

    addImage: function(src)
    {
        var image = document.createElement('img');
        $(image).attr('src', src);
        $(image).style({'z-index': helper.layers + 1});

        helper.addElement(image, {'centered': true});

        return image;
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
            if($(this).attr('type') != "submit")
            {
                input[$(this).attr('name')] = $(this).value();
            }
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
