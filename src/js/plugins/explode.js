var $ = require('wetfish-basic');
var pool = require('./pool');
var helper = require('../app/helper');

// The durations of the different explosion animations
var timeout =
{
    1: 1600,
    2: 1200,
    3: 860,
    4: 1060,
    5: 1600,
    6: 900,
    7: 1090
};

function explode(element)
{
    // Save the size and position of the current element
    var size = $(element).size();

    // Increase the size of the explosion a little bit
    size.width += 50;
    size.height += 50;

    // Adjust the translated position
    var transform = JSON.parse(JSON.stringify(element.transform));

    transform.translate[0] = (parseInt(transform.translate[0]) - 25) + 'px';
    transform.translate[1] = (parseInt(transform.translate[1]) - 25) + 'px';

    // Create an image to overlay the explosion over the current element
    var image = document.createElement('img');
    var options =
    {
        'position': 'absolute',
        'width': size.width + 'px',
        'height': size.height + 'px',
        'z-index': $(element).style('z-index')
    };

    $(image).style(options);
    $(image).transform(transform);
    $(image).addClass('bomb explosion');

    // Generate a random explosion image
    var random = helper.randomInt(1, 7);
    $(image).attr('src', 'img/explosion-' + random + '.gif');

    // Prevent the default drag behavior from messing up rapid clicking
    $(image).on('mousedown dragstart', function(event)
    {
        event.preventDefault();
        return false;
    });

    // EXPLODE!
    $('.workspace').el[0].appendChild(image);

    pool.play('explosion');

    // Remove the original element, if it's not an explosion
    if(!$(element).hasClass('explosion'))
    {
        $(element).remove();
    }

    // Remove the explosion after the animation is finished
    setTimeout(function()
    {
        $(image).remove();
    }, timeout[random])
}

module.exports = explode;
