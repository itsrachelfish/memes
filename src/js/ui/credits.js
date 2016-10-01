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
                // Make sure required vars are set
                var title = object.tile || 'Untitled ' + object.type;
                var desc = object.desc || object.url;
                var license = object.license || 'unknown';

                // Get the human readable version of the license
                var option = $('#license option[value="'+license+'"]').el[0];
                license = option.innerText || option.textContent;

                var template = $(credits.template).clone();
                $(template).find('label').text(title);
                $(template).find('.desc').text(desc);
                $(template).find('.license').text(license);

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
