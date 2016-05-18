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

        $('.pool').append(container);
    },

    play: function(name)
    {
        var started = false;
        
        $('.pool .' + name + ' audio').each(function()
        {
            // Only play audio clips that aren't already playing
            // Also, only start one audio clip per loop by checking the started variable
            if(this.duration > 0 && this.paused && !started)
            {
                started = true;

                this.currentTime = 0;
                this.play();
            }
        });
    }
};

module.exports = pool;
