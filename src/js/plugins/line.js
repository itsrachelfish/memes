var $ = require('wetfish-basic');

var line =
{
    init: function(element)
    {
        element = element || window;

        // Get the canvas element
        line.canvas = $('canvas').el[0];

        // Make sure the canvas is the same size as the window
        line.canvas.width = $(line.canvas).width();
        line.canvas.height = $(line.canvas).height();

        // Set the "center" of the line based on the passed element
        var size = $(element).size();
        var position = $(element).position();

        line.center =
        {
            x: position.left + (size.width / 2),
            y: position.top + (size.height / 2)
        };

        // Make the line white
        line.context = line.canvas.getContext("2d");
        line.context.strokeStyle = 'white';
    },

    draw: function(x, y)
    {
        line.context.beginPath();
        line.context.moveTo(line.center.x, line.center.y);
        line.context.lineTo(x, y);
        line.context.closePath();
        line.context.stroke();
    },

    refresh: function()
    {
        line.context.clearRect(0, 0, line.canvas.width, line.canvas.height);
    },
};

module.exports = line;
