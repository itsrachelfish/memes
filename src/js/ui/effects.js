// Miscelaneous effects
var $ = require('wetfish-basic');
var storage = require('../app/storage');
var timeouts = {};

var effects =
{
    init: function()
    {
        $('.workspace').on('play slides-changed pause', function()
        {
            if(storage.isPlaying())
            {
                effects.start();
            }
            else
            {
                effects.stop();
            }
        });
    },
    
    start: function()
    {
        effects.countdown.start();
    },

    stop: function()
    {
        effects.countdown.stop();
    },

    countdown:
    {
        start: function()
        {
            $('.workspace .countdown').each(function()
            {
                var classes = this.className.split(' ');
                var duration = 0;
                var modifier =
                {
                    'h': 60 * 60 * 1000,
                    'm': 60 * 1000,
                    's': 1000
                };

                classes.map(function(className)
                {
                    // If a class matches the pattern "2m, 30s, 1h, etc"
                    var match = className.match(/^([0-9]+)(h|m|s)$/);

                    if(match)
                    {
                        // Multiply the matched number by the time modifier
                        duration = match[1] * modifier[match[2]];
                    }
                });

                $(this).data('duration', duration);
                $(this).text(effects.countdown.string(duration));

                // Set timeout to start counting down
                effects.countdown.tick(this);
            });
        },

        stop: function()
        {
            Object.keys(timeouts).forEach(function(timeout)
            {
                clearTimeout(timeouts[timeout]);
            });
        },

        // Convert duration in milliseconds to hh:mm:ss string
        string: function(duration)
        {
            var time =
            [
                Math.floor(duration / (60 * 60 * 1000)),                    // Hours
                Math.floor((duration % (60 * 60 * 1000)) / (60 * 1000)),    // Minutes
                (duration / 1000) % (60)                                    // Seconds
            ];

            // Add leading zeroes
            time.map(function(value, index)
            {
                if(value < 10)
                {
                    time[index] = "0" + value;
                }
            });

            // No use displaying hours if there are none
            if(time[0] == '00')
            {
                time.shift();
            }

            return time.join(':');
        },

        tick: function(element)
        {
            var id = $(element).attr('id');
            var duration = parseInt($(element).data('duration'));

            if(id && duration)
            {
                timeouts[id] = setTimeout(function()
                {
                    duration -= 1000;
                    $(element).data('duration', duration);

                    $(element).text(effects.countdown.string(duration));
                    effects.countdown.tick(element);
                }, 1000);
            }
        }
    }
};

module.exports = effects;
