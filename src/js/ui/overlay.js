var $ = require('wetfish-basic');
var helper = require('../app/helper');

var overlay =
{
    // Global event bindings for overlays when the page is loaded
    init: function()
    {
        // Close all overlays when clicking outside of the overlay content
        $('.overlay-wrap').on('click', function(event)
        {
            // Make sure we're actually clicking on the overlay wrap, otherwise click bubbling would trigger this
            if($(event.target).hasClass('overlay-wrap'))
            {
                $('body').removeClass('overlay-open');
                $('.overlay.open').trigger('overlay-closed');
                $('.overlay').removeClass('open');
            }
        });

        $('.overlay .toggle').on('click', function()
        {
            var text = this.textContent;
            var toggle = $(this).data('toggle');
            var rel = $(this).data('rel');

            $(this).data('toggle', text);
            $(this).text(toggle);

            $(rel).toggle('hidden');
        });
    },

    // Open an overlay
    open: function(selector)
    {
        $('body').addClass('overlay-open');
        $('.overlay' + selector).addClass('open').trigger('overlay-opened');

        // Make sure the overlay is always on top
        $('.overlay' + selector).style({'z-index': helper.layers + 1});
    },

    // Close an overlay
    close: function(selector)
    {
        $('body').removeClass('overlay-open');

        // Was a selector passed?
        if(selector)
        {
            $('.overlay' + selector).removeClass('open').trigger('overlay-closed');
        }

        // Otherwise, close any open overlay
        else
        {
            $('.overlay.open').removeClass('open').trigger('overlay-closed');
        }
    },
};

module.exports = overlay;
