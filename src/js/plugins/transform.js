var $ = require('wetfish-basic');
var line = require('./line');
var extend = require('extend');

var transform =
{
    started: false,
    
    start: function(element)
    {
        if(transform.started)
        {
            return;
        }

        transform.started = true;

        $(window).on('mousemove', transform.mousemove);
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

    mousemove: function(event)
    {
        line.refresh();
        line.draw(event.clientX, event.clientY);
    },

    resize: function(event)
    {
            line.init(transform.element);
    },

    stop: function(element)
    {
        line.refresh();

        $(window).off('mousemove', transform.mousemove);
        $(window).off('resize', transform.resize);

        $('.workspace').el[0].appendChild(transform.element);
        $(transform.template).remove();

        transform.started = false;
    },
};

module.exports = transform;
