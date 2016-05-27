// Load wetfish basic
var $ = require('wetfish-basic');

// Load other stuff
var overlay = require('../ui/overlay');
var storage = require('./storage');

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
    },

    select: function(element)
    {
        // Check if the element has a unique ID
        var id = $(element).attr('id');
        var objects = storage.get('objects');

        // Now make sure it actually exists in the project's save data
        if(objects[id] !== undefined)
        {
            var object = objects[id];

            if(object.type == 'image' || object.type == 'audio' || object.type == 'video')
            {
                var selector = '.' + object.type;
                var form = '.overlay' + selector + ' form';

                // Open the overlay for this type of object
                overlay.open(selector);

                // Set the original object data in a hidden field
                $(form).append('<textarea class="temporary hidden" name="id">' + id + '</textarea>');
                $(form).append('<textarea class="temporary hidden" name="saved">' + JSON.stringify(object) + '</textarea>');

                // Basic information that applies to all images, audio, and videos
                $(form).find('input[name="url"]').value(object.url);
                $(form).find('input[name="desc"]').value(object.desc);
                $(form).find('input[name="license"]').value(object.license);

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
                alert('Coming soon LOL');
            }
            else
            {
                alert('The object you selected cannot be modified by this tool. Special objects like interactive presets cannot be edited. Sorry!');
            }
        }
    },
};

module.exports = tools;
