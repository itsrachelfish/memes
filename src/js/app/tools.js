// Load wetfish basic
var $ = require('wetfish-basic');

// Load other stuff
var overlay = require('../ui/overlay');

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
                tools[tool](this);

                // Close the tools menu
                overlay.close('.tools');

                // And open tools help menu
                overlay.open('.tools-help');

                // Display help details for this tool
                $('.tools-help .details').addClass('hidden');
                $('.tools-help .details.' + tool).removeClass('hidden');
            }
        });
    },

    // Helper function called whenever tools start being used
    start: function()
    {

    },

    // Helper function when a tool is finished being used
    stop: function()
    {

    },

    select: function()
    {
        
    },
};

module.exports = tools;
