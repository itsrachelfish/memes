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

                // And close the tools menu
                overlay.close('.tools');
            }
        });
    },

    select: function()
    {
        alert('Select stuff!');
    },
};

module.exports = tools;
