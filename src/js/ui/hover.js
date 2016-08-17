// Load wetfish basic
var $ = require('wetfish-basic');


// Module which controls the menus that appear when hovering over content
var hover =
{
    tool: 'edit',

    init: function()
    {
        // Create a clone of the hover menu html template
        var template = $('.hover-menu.hidden').clone();
        $(template).removeClass('hidden').addClass('active');

        // Save it for later
        hover.template = template;

        // Loop through any existing workspace content
        $('.workspace .content').each(function()
        {
            $(this).on('mouseenter', function(event)
            {
                hover.start(event.target);
            });
        });

        // Bind to the creation of new content
        $('.workspace').on('content-created', function(event)
        {
            $(event.detail).on('mouseenter', function(event)
            {
                hover.start(event.target);
            });
        });

        $('.workspace').on('click', '.hover-menu .icon, .hover-menu .icon *', function()
        {
            var element = this;

            // If the user clicks on the font icon instead of the wrapper element
            if(!$(this).hasClass('icon'))
            {
                element = $(this).parents('.icon').el[0];
            }

            // Update the menu currently on the page
            $('.hover-menu .icon.active').removeClass('active');
            $(element).addClass('active');

            hover.tool = $(element).data('tool');

            // Update the saved menu template
            $(hover.template).find('.icon.active').removeClass('active');
            $(hover.template).find('.icon[data-tool="'+hover.tool+'"]').addClass('active');
        });
    },
    
    start: function(element)
    {
        // Make a clone of the default hover template
        var template = $(hover.template).clone();

        // Get information about the current object
        var zindex = parseInt($(element).style('z-index'));
        var size = $(element).size();

        // Make sure no other menus are still active
        hover.stop();

        $(template).style({'height': size.height + 'px', 'width': size.width + 'px', 'z-index': zindex + 1});
        $(template).transform(element.transform);

        $(template).on('mouseleave', function()
        {
            hover.stop();
        });

        $('.workspace').el[0].appendChild(template);
    },

    stop: function()
    {
        // Remove any active menus
        $('.hover-menu.active').remove();
    }
};

module.exports = hover;
