var $ = require('wetfish-basic');
var storage = require('../app/storage');

var credits =
{
    populate: function()
    {
        var data = storage.get();

        $('.credits .title').text(data.title);
        $('.credits .author').text(data.author);

        var sources = document.createDocumentFragment();
        var source = $('.credits .source').clone();

        $('.credits .sources').html('');

        Object.keys(data.objects).forEach(function(id)
        {
            var object = data.objects[id];

            // Only certain elements have cited sources
            if(['image', 'audio', 'video'].indexOf(object.type) > -1)
            {
                object.desc = object.desc || 'Untitled ' + object.type;
                object.license = object.license || 'unknown';

                console.log('two point one');
                var template = $(source).clone();
                $(template).find('label').text(object.desc);
                $(template).find('.url').text(object.url);
                $(template).find('.license').text(object.license);

                sources.appendChild(template);
            }
        });

        $('.credits .sources').el[0].appendChild(sources);
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
