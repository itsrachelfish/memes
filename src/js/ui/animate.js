var $ = require('wetfish-basic');

var animate =
{
    status: false,

    init: function()
    {
        
    },

    start: function()
    {
        $('.workspace').addClass('highlight-content');
    },

    stop: function()
    {
        $('.workspace').removeClass('highlight-content');
    }
};

module.exports = animate;
