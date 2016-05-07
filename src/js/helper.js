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

    addImage: function(className)
    {
        var image = document.createElement('div');
        $(image).addClass(className);

        helper.addElement(image, {'centered': true});
    },

    random: function(min, max)
    {
        return Math.round(Math.random() * (max - min)) + min;
    }
};


module.exports = helper;
