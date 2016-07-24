var $ = require('wetfish-basic');
var line = require('./line');
var extend = require('extend');

var transforming = false;

var transform =
{
    start: function(element)
    {
        if(transforming)
        {
            return;
        }

        transforming = true;

        $(window).on('mousedown', '.transform .handle', transform.mousedown);
        $(window).on('mousemove', transform.mousemove);
        $(window).on('mouseup', transform.mouseup);
        $(window).on('resize', transform.resize);

        transform.element = element;
        line.init(element);

        var original = extend($(element).size(), $(element).position());
        var template = $('.transform.hidden').clone();

        $(template).removeClass('hidden');
        $(template).style({'height': original.height + 'px', 'width': original.width + 'px'});
        $(template).transform('translate', original.left + 'px', original.top + 'px');

        $('.workspace').el[0].appendChild(template);
        transform.template = template;
    },

    mousedown: function(event)
    {
        if(transforming)
        {
            $(this).addClass('active');
        }
    },

    mousemove: function(event)
    {
        if(transforming)
        {
            line.refresh();
            line.draw(event.clientX, event.clientY);
        }
    },

    mouseup: function(event)
    {
        if(transforming)
        {
            line.refresh();
            $('.transform .handle.active').removeClass('active');
        }
    },

    resize: function(event)
    {
        if(transforming)
        {
            line.init(transform.element);
        }
    },

    stop: function(element)
    {
        line.refresh();

        $(window).off('mousedown', '.transform .handle', transform.mousedown);
        $(window).off('mousemove', transform.mousemove);
        $(window).off('mouseup', transform.mouseup);
        $(window).off('resize', transform.resize);

        $(transform.template).remove();
        transforming = false;
    },
};

module.exports = transform;
