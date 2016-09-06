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

                $(frame).find('.title').text('Frame ' + (index + 1));
                $(frame).find('.objects').text(objectCount + ' objects');
                $('.frame-list').append(frame);
            });
        });

    }
};

module.exports = frames;
