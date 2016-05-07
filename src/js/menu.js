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
        $('.menu button').on('click', function()
        {
            if($(this).data('overlay'))
            {
                overlay.open($(this).data('overlay'));
            }
        });

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
    }
};

module.exports = menu;
