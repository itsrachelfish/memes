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
            var form = {};

            $(this).find('input, textarea, select').each(function()
            {
                if($(this).attr('type') != "submit")
                {
                    form[$(this).attr('name')] = $(this).value();
                }
            });

            if(!form.url)
            {
                alert("ayyyyyyyy where's the url?");
                return;
            }

            var image = helper.addImage(form.url);
            $(image).data('desc', form.desc);
            $(image).data('license', form.desc);

            overlay.close('image');
        });

        $('.sound.overlay form').on('submit', function(event)
        {
            event.preventDefault();

            console.log('cum in me');
        });

        $('.video.overlay form').on('submit', function(event)
        {
            event.preventDefault();

            console.log('cum in me');
        });

/*
        $('.add-image').on('click', function()
        {
            var src = prompt("Enter an image URL");
            var image = document.createElement('img');
            $(image).attr('src', src);

            helper.addElement(image, {'centered': true});
        });

        $('.add-sound').on('click', function()
        {
            var src = prompt("Enter a sound URL");
            var sound = document.createElement('audio');
            $(sound).attr('src', src).prop('autoplay', true).prop('controls', true);

            helper.addElement(sound, {'centered': true});
        });

        $('.add-video').on('click', function()
        {
            var src = prompt("Enter a video URL");
            var video = document.createElement('video');
            $(video).attr('src', src).prop('autoplay', true).prop('controls', true);

            helper.addElement(video, {'centered': true});
        });
        */
    }
};

module.exports = menu;
