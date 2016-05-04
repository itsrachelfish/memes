var $ = require('wetfish-basic');

var overlay =
{
    // Global event bindings for overlays when the page is loaded
    init: function()
    {
        // Close all overlays when clicking outside of the overlay content
        $('.overlays').on('click', function()
        {
            $('body').removeClass('overlay-open');
            $('.overlay').removeClass('open');
        });

        // Prevent closing overlays when clicking inside of the overlay content
        $('.overlay').on('click', function(event)
        {
            event.stopPropagation();
        });
    },

    // Open an overlay
    open: function(selector)
    {
        $('body').addClass('overlay-open');
        $('.overlay' + selector).addClass('open');
    },

    // Close an overlay
    close: function(selector)
    {
        $('body').removeClass('overlay-open');
        $('.overlay' + selector).removeClass('open');
    },
};

module.exports = overlay;
