var $ = require('wetfish-basic');
var helper = require('../app/helper');
var storage = require('../app/storage');
var transform = require('../plugins/transform');

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

            hover.initTools();
        });
    },
    
    start: function(element)
    {
        hover.element = element;

        // Make a clone of the default hover template
        var template = $(hover.template).clone();

        // Get information about the current object
        var zindex = parseInt($(element).style('z-index'));
        var size = $(element).size();

        // Make sure no other menus are still active
        hover.stop();

        $(template).style({'height': size.height + 'px', 'width': size.width + 'px', 'z-index': zindex + 1});
        $(template).transform(element.transform);

        $(template).on('click', function(event)
        {
//            console.log(event.target);
        });

        $(template).on('mouseleave', function()
        {
            hover.stop();
        });

        // Ensure the element being dragged is always on top
        $(template).on('dragstart', function()
        {
            helper.layers++;
            $(template).style({'z-index': helper.layers});
            $(element).style({'z-index': helper.layers});

            // Disable pointer-events on content while dragging
            $('.workspace .content').style({'pointer-events': 'none'})
        });

        $(template).on('dragmove', function()
        {
            $(element).transform(template.transform);
        });

        $(template).on('dragend', function()
        {
            storage.update(element);

            // Re-enable pointer-events
            $('.workspace .content').style({'pointer-events': 'auto'})
        });

        $(element).on('transformed', function(evet)
        {
            $(template).transform(element.transform);
        });

        $(template).dragondrop();
        $('.workspace').el[0].appendChild(template);

        hover.initTools();
    },

    stop: function()
    {
        // Prevent removing menus while dragging (this can happen if you move the mouse too quickly)
        if($('.hover-menu.active').hasClass('dragging'))
        {
            return;
        }

        // Remove any active menus
        $('.hover-menu.active').remove();

        transform.stop();
    },

    initTools: function()
    {
        if(hover.tool == "move")
        {
            $('.hover-menu.active').removeClass('disabled');
        }
        else
        {
            $('.hover-menu.active').addClass('disabled');
        }

        if(hover.tool == "transform")
        {
            transform.start(hover.element);
        }
        else
        {
            transform.stop();
        }
    }
};

module.exports = hover;
