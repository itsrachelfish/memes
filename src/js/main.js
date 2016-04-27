var $ = require('wetfish-basic');
var Webcam = require('./webcam');

$(document).ready(function()
{
    $('.start-webcam').on('click', function()
    {
        var webcam = new Webcam('.webcam');
    });

    $('.add-image').on('click', function()
    {
        var src = prompt("Enter an image URL");
        $('.workspace').append('<img src="'+src+'">');
    });
});
