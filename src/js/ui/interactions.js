// Load wetfish basic
var $ = require('wetfish-basic');

// Load custom modules
var tools = require('../app/tools');
var storage = require('../app/storage');
var helper = require('../app/helper');
var pool = require('../plugins/pool');

// A map of currently pressed keys
var pressed = {};

// Global timeout cache
var timeout =
{
    // The durations of the different explosion animations
    explosion:
    {
        1: 1600,
        2: 1200,
        3: 860,
        4: 1060,
        5: 1600,
        6: 900,
        7: 1090
    }
};

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
        var explosion = $('.preload .explosion').el[0];
        var hitmarker = $('.preload .hitmarker').el[0];    
        
        pool.init(explosion, 'explosion', 16);
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
                // If the click timeout is defined, this must be a double click!
                if(timeout.click)
                {
                    // If this is an audio or video element
                    if(this.nodeName && this.nodeName.toLowerCase() == 'audio' || this.nodeName.toLowerCase() == 'video')
                    {
                        // Toggle playing state
                        if(this.paused)
                        {
                            this.play();
                        }
                        else
                        {
                            this.pause();
                        }
                    }

                    timeout.click = null;
                }
                else
                {
                    // Create a timeout to determine if the user is double clicking
                    timeout.click = setTimeout(function()
                    {
                        timeout.click = null;
                    }, 250);
                }

                // If the user is holding control while clicking
                if(pressed.control)
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

        // Deleting things
        $('body').on('mousedown', '.workspace *', function(event)
        {
            // Prevent default behavior when in tool mode
            if($('body').hasClass('tool-mode'))
            {
                return;
            }

            // If right click was pressed
            if(event.buttons == 2)
            {
                // If the user is holding control while deleting an image
                if(pressed.control)
                {
                    // Save the size and position of the current element
                    var size = $(this).size();
                    var position = $(this).position();

                    // Increase the size of the explosion a little bit
                    size.width += 50;
                    size.height += 50;
                    position.top -= 25;
                    position.left -= 25;

                    // Create an image to overlay the explosion over the current element
                    var image = document.createElement('img');
                    var options =
                    {
                        'position': 'absolute',
                        'top': position.top + 'px',
                        'left': position.left + 'px',
                        'width': size.width + 'px',
                        'height': size.height + 'px',
                        'z-index': $(this).style('z-index')
                    };

                    $(image).style(options);
                    $(image).addClass('explosion');

                    // Generate a random explosion image
                    var random = helper.randomInt(1, 7);
                    $(image).attr('src', 'img/explosion-' + random + '.gif');
                    
                    // EXPLODE!
                    $('.workspace').el[0].appendChild(image);

                    pool.play('explosion');

                    // Remove the original element, if it's not an explosion
                    if(!$(this).hasClass('explosion'))
                    {
                        $(this).remove();
                    }

                    // Remove the explosion after the animation is finished
                    setTimeout(function()
                    {
                        $(image).remove();
                    }, timeout.explosion[random])
                }
                else
                {
                    // Otherwise just remove it
                    $(this).remove();
                }

                storage.remove(this);
            }
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
            pressed[key] = true;

            // Keyboard shortcuts that trigger when a user presses escape
            if(key == 'escape')
            {
                // Is an overlay open?
                if($('body').hasClass('overlay-open'))
                {
                    overlay.close();
                }
                
                // Are we in tool mode?
                else if($('body').hasClass('tool-mode'))
                {
                    tools.stop();
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
            delete pressed[key];
        });
    },
};

module.exports = interactions;
