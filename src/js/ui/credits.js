var $ = require('wetfish-basic');
var storage = require('../app/storage');

var credits =
{
    objects: 0,
    template: false,

    populate: function()
    {
        var data = storage.get();
        var sources = document.createDocumentFragment();

        $('.credits-overlay .title').text(data.title);
        $('.credits-overlay .author').text(data.author);

        if(!credits.template)
        {
            credits.template = $('.credits-overlay .source').clone();
        }

        // Reset objects count
        credits.objects = 0;

        Object.keys(data.objects).forEach(function(id)
        {
            var object = data.objects[id];

            // If this object is excluded from credits, continue
            if(object.exclude)
            {
                return;
            }

            // Only certain elements have cited sources
            if(['image', 'audio', 'video'].indexOf(object.type) > -1)
            {
                // Make sure required vars are set
                var title = object.title || 'Untitled ' + object.type;
                var desc = object.desc || object.url;
                var license = object.license || 'unknown';

                // Get the human readable version of the license
                var option = $('#license option[value="'+license+'"]').el[0];
                license = option.innerText || option.textContent;

                var template = $(credits.template).clone();
                $(template).find('label').text(title);
                $(template).find('.desc span').text(desc);
                $(template).find('.license').text(license);

                sources.appendChild(template);
                credits.objects++;
            }
        });

        $('.credits-overlay .sources').html('');
        $('.credits-overlay .sources').el[0].appendChild(sources);
    },

    show: function()
    {
        $('.credits-overlay').removeClass('hidden');

        credits.populate();
        var duration = (credits.objects + 10) + 's';
        var height = (parseInt($('.credits-overlay .credits').height()) + (parseInt($(window).height()) * 2)) * -1;

        var options =
        {
            'transition': 'all ' + duration + ' linear',
            'transform': 'translateY(' + height + 'px)'
        };

        $('.credits-overlay .credits').style(options);
    },

    hide: function()
    {
        var options =
        {
            'transition': 'all 0.01s linear',
            'transform': 'translateY(0px)'
        };

        $('.credits-overlay .credits').style(options);

        setTimeout(function()
        {
            $('.credits-overlay').addClass('hidden');
        }, 10);
    },
};

module.exports = credits;
