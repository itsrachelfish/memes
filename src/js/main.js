var $ = require('wetfish-basic');
var Webcam = require('./webcam');

$(document).ready(function()
{
    $('.start-webcam').on('click', function()
    {
        var webcam = new Webcam('.webcam');
    });
});
