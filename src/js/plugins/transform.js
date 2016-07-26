var $ = require('wetfish-basic');
var line = require('./line');
var extend = require('extend');

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
        delete transform.angle;
        delete transform.scale;
        
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

        transform.element = element;
        line.init(element);

        var position =
        {
            x: parseInt(element.transform.translate[0]), // Because wetfish basic is awesome <3
            y: parseInt(element.transform.translate[1])
        };

        var size = $(element).size();
        transform.size = size;
        
        var template = $('.transform.hidden').clone();

        transform.center =
        {
            x: position.x + (size.width / 2),
            y: position.y + (size.height / 2)
        };

        // Which dimension is bigger?
        transform.dimension = (size.height > size.width) ? 'height' : 'width';

        $(template).removeClass('hidden');
        $(template).style({'height': size.height + 'px', 'width': size.width + 'px'});
        $(template).transform('translate', position.x + 'px', position.y + 'px');

        transform.angle = parseFloat($(element).data('rotate'));
        transform.scale = parseFloat($(element).data('scale'));

        // If this element has already been rotated
        if(transform.angle)
        {
            // Set the new template to the same angle
            $(template).transform('rotate', transform.angle + 'deg');
        }

        // If this element has already been scaled
        if(transform.scale)
        {
            $(template).transform('scale', transform.scale);
        }

        $('.workspace').el[0].appendChild(template);
        transform.template = template;
    },

    stop: function(element)
    {
        line.refresh();
        $(transform.template).remove();
        transform.template = false;
        transform.element = false;
    },

    mousedown: function(event)
    {
        $(this).addClass('active');

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
            $(transform.element).data('rotate', angle);
            $(transform.element).data('scale', scale);
        }
    },

    mouseup: function(event)
    {
        if(transforming)
        {
            line.refresh();
            $('.transform .handle.active').removeClass('active');
            transforming = false;
        }
    },

    resize: function(event)
    {
        if(transforming)
        {
            line.init(transform.element);
        }
    },
};

module.exports = transform;
