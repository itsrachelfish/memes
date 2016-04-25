var $ = require('wetfish-basic');

$(document).ready(function()
{
    setInterval(function()
    {
        if($('body').hasClass('inverted'))
        {
            $('body').removeClass('inverted');
        }
        else
        {
            $('body').addClass('inverted');
        }
    }, 1000);
});
