// Load wetfish basic
var $ = require('wetfish-basic');

// Miscellaneous helper functions
var helper =
{
    // Used to stack elements ontop of eachother as you move them
    layers: 0,

    randomInt: function(min, max)
    {
        return Math.round(Math.random() * (max - min)) + min;
    },

    randomString: function()
    {
        // Remove leading numbers because they are not valid html IDs
        return Math.random().toString(36).slice(2).replace(/^[0-9]+/, '');
    },

    serialize: function(form)
    {
        var input = {};

        $(form).find('input, textarea, select').each(function()
        {
            if($(this).attr('type') == "submit")
            {
                return;
            }

            if($(this).attr('type') == 'checkbox')
            {
                if($(this).prop('checked'))
                {
                    input[$(this).attr('name')] = true;
                }
                else
                {
                    input[$(this).attr('name')] = false;
                }

                return;
            }

            input[$(this).attr('name')] = $(this).value();

        });

        return input;
    },

    validate: function(input)
    {
        if(!input.url)
        {
            alert("ayyyyyyyy where's the url?");
            return false;
        }

        return true;
    },
};


module.exports = helper;
