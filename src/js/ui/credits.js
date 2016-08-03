var $ = require('wetfish-basic');
var storage = require('../app/storage');

var credits =
{
    populate: function()
    {
        var data = storage.get();

        $('.credits .title').text(data.title);
        $('.credits .author').text(data.author);
    },

    show: function()
    {
        credits.populate();
        
        $('.credits-overlay').removeClass('hidden');
        $('.credits').addClass('scroll');
    },

    hide: function()
    {
        $('.credits-overlay').addClass('hidden');
        $('.credits').removeClass('scroll');
    },
};

module.exports = credits;
