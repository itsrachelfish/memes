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

        var original = extend($(element).size(), $(element).position());
        var template = $('.transform.hidden').clone();

        transform.center =
        {
            x: original.left + (original.width / 2),
            y: original.top + (original.height / 2)
        };

        $(template).removeClass('hidden');
        $(template).style({'height': original.height + 'px', 'width': original.width + 'px'});
        $(template).transform('translate', original.left + 'px', original.top + 'px');

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

            var angle = degrees(Math.atan2(difference.y, difference.x)) + transform.offset;
            $(transform.template).transform('rotate', angle + 'deg');
            $(transform.element).transform('rotate', angle + 'deg');
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
