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
                $(image).data('license', input.desc);

                overlay.close('image');
            }
        });

        $('.sound.overlay form').on('submit', function(event)
        {
            event.preventDefault();

            var src = prompt("Enter a sound URL");
            var sound = document.createElement('audio');
            $(sound).attr('src', src).prop('autoplay', true).prop('controls', true);

            helper.addElement(sound, {'centered': true});
        });

        $('.video.overlay form').on('submit', function(event)
        {
            event.preventDefault();

            var src = prompt("Enter a video URL");
            var video = document.createElement('video');
            $(video).attr('src', src).prop('autoplay', true).prop('controls', true);

            helper.addElement(video, {'centered': true});
        });
    }
};

module.exports = menu;
