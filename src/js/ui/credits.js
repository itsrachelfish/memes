var $ = require('wetfish-basic');
var storage = require('../app/storage');

var credits =
{
    template: false,

    populate: function()
    {
        var data = storage.get();
        var sources = document.createDocumentFragment();

        $('.credits .title').text(data.title);
        $('.credits .author').text(data.author);

        if(!credits.template)
        {
            credits.template = $('.credits .source').clone();
        }

        Object.keys(data.objects).forEach(function(id)
        {
            var object = data.objects[id];

            // Only certain elements have cited sources
            if(['image', 'audio', 'video'].indexOf(object.type) > -1)
            {
                object.desc = object.desc || 'Untitled ' + object.type;
                object.license = object.license || 'unknown';

                var template = $(credits.template).clone();
                $(template).find('label').text(object.desc);
                $(template).find('.url').text(object.url);
                $(template).find('.license').text(object.license);

                sources.appendChild(template);
            }
        });

        $('.credits .sources').html('');
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
