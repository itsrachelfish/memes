// Load wetfish basic
var $ = require('wetfish-basic');

// Load custom modules
var Webcam = require('./webcam');
var helper = require('./helper');
var overlay = require('./overlay');

// Global webcam object
var webcam;

var menu =
{
    // Global menu event bindings when the page is loaded
    init: function()
    {
        // Make sure the menu is on top when you're mousing over it
        $('.menu').on('mouseenter touchstart', function()
        {
            $(this).style({'z-index': helper.layers + 1});
        });

        // Check if menu buttons open an overlay
        $('.menu button').on('click', function()
        {
            if($(this).data('overlay'))
            {
                overlay.open($(this).data('overlay'));
            }
        });

        // Webcam stuff
        $('.start-webcam').on('click', function()
        {
            $(this).addClass('hidden');
            $('.stop-webcam').removeClass('hidden');
            
            webcam = new Webcam('.webcam');
        });

        $('.stop-webcam').on('click', function()
        {
            $(this).addClass('hidden');
            $('.start-webcam').removeClass('hidden');

            webcam.stop();
            $('.webcam').attr('src', '');
        });

        // Slideshow playback
        $('.play').on('click', function()
        {
            $(this).addClass('hidden');
            $('.pause').removeClass('hidden');
        });

        $('.pause').on('click', function()
        {
            $(this).addClass('hidden');
            $('.play').removeClass('hidden');
        });

        $('.image.overlay form').on('submit', function(event)
        {
            event.preventDefault();
            var input = helper.serialize(this);

            if(helper.validate(input))
            {
                var image = helper.addImage(input.url);
                $(image).data('desc', input.desc);
                $(image).data('license', input.license);

                overlay.close('image');
            }
        });

        $('.sound.overlay form').on('submit', function(event)
        {
            event.preventDefault();
            var input = helper.serialize(this);

            if(helper.validate(input))
            {
                var sound = document.createElement('audio');
                $(sound).attr('src', input.url);
                $(sound).attr('volume', input.volume);
                $(sound).attr('autoplay', input.autoplay);
                $(sound).attr('loop', input.loop);
                $(sound).attr('controls', true);

                $(sound).data('desc', input.desc);
                $(sound).data('license', input.license);

                helper.addElement(sound, {'centered': true});

                overlay.close('sound');
            }
        });

        $('.video.overlay form').on('submit', function(event)
        {
            event.preventDefault();
            var input = helper.serialize(this);

            if(helper.validate(input))
            {
                var video = document.createElement('audio');
                $(video).attr('src', input.url);
                $(video).attr('volume', input.volume);
                $(video).attr('autoplay', input.autoplay);
                $(video).attr('loop', input.loop);

                $(video).data('desc', input.desc);
                $(video).data('license', input.license);

                helper.addElement(video, {'centered': true});

                overlay.close('video');
            }
        });
    }
};

module.exports = menu;
