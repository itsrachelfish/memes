var $ = require('wetfish-basic');
var line = require('./line');
var extend = require('extend');
var storage = require('../app/storage');

var loaded = false;
var transforming = false;

function radians(degrees)
{
    return  degrees * Math.PI / 180;
}

function degrees(radians)
{
    return radians * 180 / Math.PI;
}

function distance(start, end)
{
    var delta =
    {
        x: end.x - start.x,
        y: end.y - start.y
    }

    delta.x *= delta.x;
    delta.y *= delta.y;

    return Math.sqrt(delta.x + delta.y);
}

var transform =
{
    load: function(element)
    {
        $(window).on('mousedown', '.transform', transform.passthru);
        $(window).on('mousedown', '.transform .handle', transform.mousedown);
        $(window).on('mousemove', transform.mousemove);
        $(window).on('mouseup', transform.mouseup);
        $(window).on('resize', transform.resize);
        loaded = true;
    },

    unload: function(element)
    {
        delete transform.element;
        delete transform.size;
        delete transform.center;
        delete transform.dimension;
        delete transform.template;
        
        $(window).off('mousedown', '.transform', transform.passthru);
        $(window).off('mousedown', '.transform .handle', transform.mousedown);
        $(window).off('mousemove', transform.mousemove);
        $(window).off('mouseup', transform.mouseup);
        $(window).off('resize', transform.resize);
        loaded = false;
    },

    start: function(element)
    {
        // Have all of the transform events been loaded yet?
        if(!loaded)
        {
            transform.load();
        }

        // If a transformation was already started, stop it!
        if(transform.element)
        {
            transform.stop();
        }

        var template = $('.transform.hidden').clone();

        transform.template = template;
        transform.element = element;
        line.init(element);

        var position =
        {
            x: parseInt(element.transform.translate[0]), // Because wetfish basic is awesome <3
            y: parseInt(element.transform.translate[1])
        };

        var size = $(element).size();
        transform.size = size;

        transform.center =
        {
            x: position.x + (size.width / 2),
            y: position.y + (size.height / 2)
        };

        // Which dimension is bigger?
        transform.dimension = (size.height > size.width) ? 'height' : 'width';

        $(template).removeClass('hidden');
        $(template).style({'height': size.height + 'px', 'width': size.width + 'px', 'z-index': parseInt($(element).style('z-index')) + 1});
        $(template).transform(element.transform);

        transform.resizeHandles();

        $('.workspace').el[0].appendChild(template);
    },

    stop: function(element)
    {
        if(transform.template)
        {
            $(transform.template).remove();
        }

        line.refresh();
        transform.template = false;
        transform.element = false;
    },

    // When clicking on the transform wrapper, see if the click should be passed through to another element
    passthru: function(event)
    {
        // Temporarilly reset the z-index
        var zindex = $(transform.template).style('z-index');
        $(transform.template).style({'z-index': -1});

        // Now check if there is something to click on
        var target = document.elementFromPoint(event.clientX, event.clientY);
        $(target).trigger('click', {bubbles: true});

        // Make sure the transform template still exists
        if(transform.template)
        {
            // Set the z-index back
            $(transform.template).style({'z-index': zindex});
        }
    },

    mousedown: function(event)
    {
        $(this).addClass('active');

        // Disable pointer-events on content while transforming
        $('.workspace .content').style({'pointer-events': 'none'})

        transform.offset = parseInt($(this).data('offset'));
        transforming = true;
    },

    mousemove: function(event)
    {
        if(transforming)
        {
            line.refresh();
            line.draw(event.clientX, event.clientY);

            // Get the angle of the line relative to the origin
            var difference =
            {
                x: event.clientX - transform.center.x,
                y: event.clientY - transform.center.y
            };

            // Calculate the new size of the element based on the distance from the center to the current mouse position
            var size = distance(transform.center, {x: event.clientX, y: event.clientY}) * 2;
            var original = transform.size[transform.dimension];
            var scale = size / original;
            var angle = degrees(Math.atan2(difference.y, difference.x)) + transform.offset;
            $(transform.template).transform('rotate', angle + 'deg').transform('scale', scale);
            $(transform.element).transform('rotate', angle + 'deg').transform('scale', scale);

            transform.resizeHandles();

            $(transform.element).trigger('transformed');
        }
    },

    mouseup: function(event)
    {
        if(transforming)
        {
            // Re-enable pointer-events
            $('.workspace .content').style({'pointer-events': 'auto'})

            line.refresh();
            $('.transform .handle.active').removeClass('active');
            transforming = false;

            // Persist changes to localstorage
            storage.update(transform.element);
        }
    },

    resize: function(event)
    {
        if(transforming)
        {
            line.init(transform.element);
        }
    },

    // Preserve the original size of the transform handles
    resizeHandles: function()
    {
        if(transform.element.transform.scale < 1)
        {
            $(transform.template).find('.handle').transform('scale', 1 / transform.element.transform.scale);
        }
    },
};

module.exports = transform;
