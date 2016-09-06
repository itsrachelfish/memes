var $ = require('wetfish-basic');
var storage = require('../app/storage');

var frames =
{
    init: function()
    {
        frames.template = $('.frame.hidden').clone();
        $(frames.template).removeClass('hidden');
        
        $('.frames').on('overlay-opened', function()
        {
            // Clear any previous frames
            $('.frame-list .frame').remove();

            // Get the current project data
            var project = storage.get();

            project.frames.forEach(function(data, index)
            {
                var frame = $(frames.template).clone();
                
                if(index == project.frame)
                {
                    $(frame).addClass('active');
                }

                var objectCount = Object.keys(data).length;

                if(data.background !== undefined)
                {
                    objectCount--;
                }

                $(frame).find('.title .text').text('Frame ' + (index + 1));
                $(frame).find('.objects').text(objectCount + ' objects');

                $(frame).on('click', frames.click);

                $('.frame-list').el[0].appendChild(frame);
            });
        });

        $('.frames .create').on('click', function()
        {
            storage.frame.create();
        });

        $('.frames .copy').on('click', function()
        {
            var frame = parseInt(storage.get('frame'));
            storage.frame.copy(frame);
        });

        // Refresh which frames are displayed
        $('.workspace').on('frames-changed', function()
        {
            $('.frames').trigger('overlay-opened');
        });
    },

    click: function()
    {
        // Switch the frame to whichever frame was clicked on
        var index = $(this).index();
        storage.frame.goto(index);

        $('.frame-list .frame.active').removeClass('active');
        $(this).addClass('active');
    },
};

module.exports = frames;
