// Load wetfish basic
var $ = require('wetfish-basic');
require('dragondrop');

// Load custom modules
var templates = require('./plugins/templates');
var pool = require('./plugins/pool');

var storage = require('./app/storage');
var tools = require('./app/tools');

var menu = require('./ui/menu');
var overlay = require('./ui/overlay');
var interact = require('./ui/interactions');
var hover = require('./ui/hover');
var ranges = require('./ui/ranges');
var config = require('./config');

$(document).ready(function()
{
    templates.ready(function()
    {
        storage.init(config);
        tools.init();

        menu.init();
        overlay.init();
        interact.init();
        hover.init();
        ranges.init();

        // Misc stuff
        var explosion = $('.preload .explosion').el[0];
        pool.init(explosion, 'explosion', 16);
    });
});
