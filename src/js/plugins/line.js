var $ = require('wetfish-basic');

var line =
{
    init: function()
    {
        line.canvas = $('canvas').el[0];

        var size = $(line.canvas).size();
        var position = $(line.canvas).position();

        line.center =
        {
            x: size.width / 2,
            y: size.height / 2
        };

        line.offset =
        {
            x: position.left,
            y: position.top
        };

        line.canvas.width = size.width;
        line.canvas.height = size.height;

        line.context = line.canvas.getContext("2d");
        line.context.strokeStyle = 'white';
    },

    draw: function(x, y)
    {
        x -= line.offset.x;
        y -= line.offset.y;

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
