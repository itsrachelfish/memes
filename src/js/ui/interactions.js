// Load wetfish basic
var $ = require('wetfish-basic');

// Load custom modules
var tools = require('../app/tools');
var storage = require('../app/storage');
var helper = require('../app/helper');
var pool = require('../plugins/pool');
var explode = require('../plugins/explode');
var overlay = require('./overlay');

// Key codes for control characters
var keys =
{
    8: 'backspace',
    9: 'tab',
    16: 'shift',
    17: 'control',
    18: 'alt',
    20: 'caps',
    27: 'escape',
    46: 'delete',
    91: 'system',
};

// Miscelaneous UI interactions
var interactions =
{
    init: function()
    {
        var hitmarker = $('.preload .hitmarker').el[0];
        pool.init(hitmarker, 'hitmarker', 7);

        // Hitmarkers
        $('body').on('mousedown touchstart', '.workspace, .workspace *', function(event)
        {
            // Prevent default behavior when in tool mode
            if($('body').hasClass('tool-mode'))
            {
                return;
            }

            // If left click was pressed, or this is a touch event
            if(!event.buttons || event.buttons == 1)
            {
                // If the user is holding control while clicking
                if(helper.pressed.control)
                {
                    var position =
                    {
                        top: event.clientY + window.scrollY,
                        left: event.clientX + window.scrollX
                    };

                    var image = document.createElement('img');
                    $(image).style({'top': position.top + 'px', 'left': position.left + 'px', 'z-index': helper.layers + 1});
                    $(image).addClass('hitmarker');
                    $(image).attr('src', 'img/hitmarker.png');
                    $('.workspace').el[0].appendChild(image);

                    pool.play('hitmarker');

                    // Remove the image after a bit
                    setTimeout(function()
                    {
                        $(image).remove();
                    }, 500);
                }
            }
        });

        // Random exploding things
        $('body').on('mousedown touchstart', '.bomb', function(event)
        {
            // If the bomb is a link and you left clicked, make sure you still go to the link
            if((!event.buttons || event.buttons == 1) && $(this).parents('a').el.length)
            {
                var url = $(this).parents('a').attr('href');

                setTimeout(function()
                {
                    window.location = url;
                }, 250);
            }

            explode(this);
        });

        $('body').on('contextmenu', function(event)
        {
            // Is the current element the workspace or a child of it?
            if($(event.target).hasClass('workspace') || $(event.target).parents('.workspace').el.length)
            {
                // Prevent right-click menu from appearing
                event.preventDefault();
            }

            // Otherwise, let menus appear normally
        });

        $('body').on('keydown', function(event)
        {
            var key = (event.key) ? event.key.toLowerCase() : keys[event.which];
            helper.pressed[key] = true;

            // Keyboard shortcuts that trigger when a user presses escape
            if(key == 'escape')
            {
                // Is an overlay open?
                if($('body').hasClass('overlay-open'))
                {
                    overlay.close();
                }

                // Otherwise, toggle the menu when pressing escape
                else
                {
                    $('.menu').toggle('hidden');
                }
            }
        });

        $('body').on('keyup', function(event)
        {
            var key = (event.key) ? event.key.toLowerCase() : keys[event.which];
            delete helper.pressed[key];
        });
    },
};

module.exports = interactions;
