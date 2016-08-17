// Load wetfish basic
var $ = require('wetfish-basic');


// Module which controls the menus that appear when hovering over content
var hover =
{
    bind: function()
    {

    },
    
    init: function()
    {
        $('.workspace .dragon').on('mouseenter', function(event)
        {
            var zindex = parseInt($(event.target).style('z-index'));
            var size = $(event.target).size();
            var template = $('.hover-menu.hidden').clone();

            $(template).removeClass('hidden').addClass('active');
            $(template).style({'height': size.height + 'px', 'width': size.width + 'px', 'z-index': zindex + 1});
            $(template).transform(event.target.transform);

            $(template).on('mouseleave', function()
            {
                $(template).remove();
            });

            $('.workspace').el[0].appendChild(template);
        });

    },
};

module.exports = hover;
