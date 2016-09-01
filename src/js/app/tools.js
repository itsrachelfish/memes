// Load wetfish basic
var $ = require('wetfish-basic');

// Load other stuff
var overlay = require('../ui/overlay');
var storage = require('./storage');
var transform = require('../plugins/transform');

// Private variable for tracking the current tool in use
var active = false;

// Public object for all tool related functions
var tools =
{
   init: function()
    {
        $('.tools button').on('click', function()
        {
            var tool = $(this).data('tool');

            // If there is a handler function for this tool
            if(typeof(tools[tool]) === "function")
            {
                tools.start();
                active = tool;

                // Close the tools menu
                overlay.close('.tools');

                // Does the user want to see help windows?
                var tooCool = parseInt(localStorage.getItem('tooCoolForHelp'));

                if(!tooCool)
                {
                    // Then open tools help menu
                    overlay.open('.tools-help');

                    // Display help details for this tool
                    $('.tools-help .details').addClass('hidden');
                    $('.tools-help .details.' + tool).removeClass('hidden');
                }
            }
        });

        $('.tools-help .accept-help').on('click', function()
        {
            overlay.close('.tools-help');
        });

        $('.tools-help .enough-help').on('click', function()
        {
            overlay.close('.tools-help');
            localStorage.setItem('tooCoolForHelp', 1);
        });

        // When clicking on a draggable element in tool mode
        $('body').on('click', '.tool-mode .dragon', function(event)
        {
            event.preventDefault();

            // Pass the clicked element to the active tool handler
            tools.element = this;
            tools[active](this);
        });
    },

    // Helper function called whenever tools start being used
    start: function()
    {
        $('body').addClass('tool-mode');
        $('.workspace .dragon').addClass('disabled');
    },

    // Helper function when a tool is finished being used
    stop: function()
    {
        active = false;
        $('body').removeClass('tool-mode');
        $('.workspace .dragon').removeClass('disabled');

        // Make sure transformation is stopped
        transform.stop(tools.element);
        transform.unload();

        // Set the menu text back to normal
        $('h1.add').removeClass('hidden');
        $('h1.edit').addClass('hidden');
    },

    interact: function(element)
    {
        // If element is an audio or video element
        if($(element).hasClass('audio-wrap video-wrap', 'or'))
        {
            var player = $(element).find('.element').el[0];

            // Toggle playing state
            if(player.paused)
            {
                player.play();
            }
            else
            {
                player.pause();
            }
        }
        // Otherwise just trigger a click
        else
        {
            $(element).trigger('mousedown', {bubbles: true});
        }
    },

    edit: function(element)
    {
        // Check if the element has a unique ID
        var id = $(element).attr('id');
        var object = storage.getObject(id);

        // Now make sure it actually exists in the project's save data
        if(object !== undefined)
        {
            if(object.type == 'image' || object.type == 'audio' || object.type == 'video')
            {
                var selector = '.' + object.type;
                var parent = '.overlay' + selector;
                var form = '.overlay' + selector + ' form';

                // Open the overlay for this type of object
                overlay.open(selector);

                $(parent).find('.add').addClass('hidden');
                $(parent).find('.edit').removeClass('hidden');

                // Set the original object data in a hidden field
                $(form).append('<textarea class="temporary hidden" name="id">' + id + '</textarea>');
                $(form).append('<textarea class="temporary hidden" name="saved">' + JSON.stringify(object) + '</textarea>');

                // Basic information that applies to all images, audio, and videos
                $(form).find('input[name="url"]').value(object.url);
                $(form).find('input[name="desc"]').value(object.desc);
                $(form).find('select[name="license"]').value(object.license);

                // Options specific to audio and video elements
                if(object.type == 'audio' || object.type == 'video')
                {
                    $(form).find('input[name="volume"]').value(object.url);
                    $(form).find('input[name="controls"]').prop('checked', object.controls);
                    $(form).find('input[name="autoplay"]').prop('checked', object.autoplay);
                    $(form).find('input[name="loop"]').prop('checked', object.loop);
                }
            }
            else if(object.type == 'text')
            {
                overlay.open('.text');

                var parent = '.overlay.text';
                var form = '.overlay.text form';

                $(parent).find('.add').addClass('hidden');
                $(parent).find('.edit').removeClass('hidden');

                // Set the original object data in a hidden field
                $(form).append('<textarea class="temporary hidden" name="id">' + id + '</textarea>');
                $(form).append('<textarea class="temporary hidden" name="saved">' + JSON.stringify(object) + '</textarea>');

                // Add saved options into the form
                $(form).find('input[name="text"]').value(object.text);
                $(form).find('input[name="text-color"]').value(object['text-color']);
                $(form).find('input[name="text-image"]').value(object['text-image']);
                $(form).find('input[name="text-size"]').value(object['text-size']);
                $(form).find('input[name="border"]').prop('checked', object.border.enabled).trigger('change', {bubbles: true});
                $(form).find('input[name="border-color"]').value(object['border-color']);
                $(form).find('input[name="border-image"]').value(object['border-image']);
                $(form).find('input[name="border-size"]').value(object['border-size']);
            }
            else
            {
                $(element).trigger('mousedown', {bubbles: true});
            }
        }
    },

    transform: function(element)
    {
        transform.start(element);
    },
};

module.exports = tools;
