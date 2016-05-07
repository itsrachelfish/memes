var $ = require('wetfish-basic');

// Object pooler
var pool =
{
    // Function to create object pools
    init: function(element, name, amount)
    {
        var container = document.createElement('div');
        $(container).addClass(name);

        for(var i = 0; i < amount; i++)
        {
            $(container).append(element);
        }

        $('.preload').append(container);
    }
};

module.exports = pool;
