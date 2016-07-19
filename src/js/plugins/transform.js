var $ = require('wetfish-basic');
var line = require('./line');

var transform =
{
    start: function(element)
    {
        $(window).on('mousemove', transform.mousemove);
        $(window).on('resize', transform.resize);

        transform.element = element;
        line.init(element);
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
    },
};

module.exports = transform;
