var $ = require('wetfish-basic');
var storage = require('../app/storage');

var animate =
{
    active: false,
    element: false,

    init: function()
    {
        // Save the default element notification text
        animate.defaultText = $('.menu .animate .element').el[0].textContent;

        $('body').on('click', '.workspace .content, .workspace .content *', function()
        {
            var element = this;

            if(!$(element).hasClass('content'))
            {
                element = $(this).parents('.content').el[0];
            }

            if(animate.active)
            {
                animate.element = element;
                animate.populate();
                animate.menu();
            }
        });
    },

    // Populate data from saved object
    populate: function()
    {
        var id = $(animate.element).attr('id');
        var object = storage.getObject(id);

        var  desc = object.desc || 'untitled ' + object.type;
        $('.menu .animate .element').text(desc);
    },

    // Display menu options based on the current animation state
    menu: function()
    {
        if(animate.element)
        {
            $('.element-selected').removeClass('hidden');
        }
        else
        {
            $('.element-selected').addClass('hidden');
        }
    },

    start: function()
    {
        $('.workspace').addClass('highlight-content');
        animate.active = true;
    },

    stop: function()
    {
        $('.workspace').removeClass('highlight-content');
        animate.active = false;
        animate.element = false;

        $('.menu .animate .element').text(animate.defaultText);
    }
};

module.exports = animate;
