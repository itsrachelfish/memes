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

        line.center =
        {
            x: parseFloat(element.transform.translate[0]) + (size.width / 2),
            y: parseFloat(element.transform.translate[1]) + (size.height / 2)
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
