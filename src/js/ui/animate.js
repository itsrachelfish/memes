var $ = require('wetfish-basic');
var storage = require('../app/storage');
var helper = require('../app/helper');

var animate =
{
    active: false,
    element: false,
    object: false,
    frame: 0,
    frames: [],
    animation: false,
    duration: 1000,

    init: function()
    {
        // Save the default element notification text
        animate.defaultText = $('.menu .animate .element').el[0].textContent;

        $('body').on('click', '.workspace .content, .workspace .content *', function()
        {
            var element = this;

            // If we clicked on a child element
            if(!$(element).hasClass('content'))
            {
                // Find the parent content element
                element = $(this).parents('.content').el[0];
            }

            if(animate.active)
            {
                animate.element = element;
                animate.populate();
                animate.menu();
            }
        });

        $('.animate .new').on('click', function()
        {
             var name = prompt("Please enter a memorable name for this animation.");

             if(animate.object.animation !== undefined && animate.object.animation[name] !== undefined)
             {
                var replace = confirm("An animation named '" + name + "' already exists. Are you sure you want to overwrite it?");

                if(!replace)
                {
                    return;
                }
             }

            animate.name = name;
            animate.frame = 0;
            animate.frames = [];

            animate.populate();
            animate.save();
        });

        $('.animate .animations select').on('change', function(event)
        {
            var animation = $(this).value();

            // Only trigger when an actual animation is selected
            if(animation)
            {
                animate.name = animation;
                animate.frame = 0;
                animate.frames = animate.object.animation[animate.name];

                $('.animation-selected').removeClass('hidden');
                $('#frame').attr('max', animate.frames.length - 1);

                helper.hover.enabled = true;

                animate.refresh();
            }
            else
            {
                $('.animation-selected').addClass('hidden');
                helper.hover.enabled = false;
            }
        });

        $('.animate .new-frame').on('click', function()
        {
            // Add a new frame after the current position
            animate.frames.splice(animate.frame + 1, 0, {});            
            animate.frame++;

            $('#frame').attr('max', animate.frames.length - 1);
            $('#frame').value(animate.frame);

            animate.save();
        });

        $('#duration').on('input change', function()
        {
            animate.duration = parseInt($(this).value());
        });

        $('#frame').on('input change', function()
        {
            // If the frame has changed and there is more than one frame
            if(animate.frame != $(this).value())
            {

                // Set the current time of the animation to match the value of the slider
                animate.frame = parseInt($(this).value());
                animate.refresh();
            }
        });

        // Delete an entire animation
        $('.animate .delete').on('click', function()
        {
            storage.animation.delete(animate.element, animate.name);
            animate.populate();
        });

        $('.animate .enabled').on('click', function()
        {
            console.log('wauuoooah?', this.checked);
            if(this.checked)
            {
                console.log('play?');
                animate.play();
            }
            else
            {
                animate.pause();
            }
        });

        $('.workspace').on('content-updated', function(event)
        {
            var updatedElement = event.detail;

            if(animate.element == updatedElement)
            {
                animate.save();
            }
        });
    },

    // Populate data from saved object
    populate: function()
    {
        var id = $(animate.element).attr('id');
        var object = storage.getObject(id);

        animate.object = object;

        var  desc = object.desc || 'untitled ' + object.type;
        $('.menu .animate .element').text(desc);

        if(object.animation !== undefined && Object.keys(object.animation).length)
        {
            // Remove any previously created animations
            $('.animate .animations .custom').remove();
            $('.animate .animations').removeClass('hidden');

            // Loop through saved animatinos and populate the dropdown
            Object.keys(object.animation).forEach(function(name)
            {
                var option = document.createElement('option');
                $(option).addClass('custom');
                $(option).text(name);
                $('.animate .animations select').append(option).trigger('change');
            });
        }
        else
        {
            $('.animate .animations').addClass('hidden');
        }
    },

    // Save current transform data
    save: function()
    {
        // Get the current computed transform style
        var transform = $(animate.element).style('transform');
        animate.frames[animate.frame] = JSON.parse(JSON.stringify({'computed': transform, 'basic': animate.element.transform}));
        animate.object.animation[animate.name] = animate.frames;

        storage.animation.save(animate.element, animate.name, animate.frames);
    },

    refresh: function()
    {
        var frame = animate.frames[animate.frame];
        $(animate.element).transform(frame.basic);
    },

    play: function()
    {
        try
        {
            var frames = [];

            animate.frames.forEach(function(frame)
            {
                frames.push(frame.computed);
            });

            animate.animation = animate.element.animate({'transform': frames}, {'duration': animate.duration, 'iterations': Infinity});

            var durationPerFrame = animate.duration / (animate.frames.length - 1);
            var currentTime = durationPerFrame * animate.frame;

            if(currentTime > 1)
            {
                currentTime--;
            }

            animate.animation.currentTime = currentTime;
            helper.hover.enabled = false;
        }
        catch(exception)
        {
            console.log(exception);
            animate.animation = false;
            helper.hover.enabled = true;
        }
    },

    pause: function()
    {
        if(animate.animation)
        {
            animate.animation.cancel();
            helper.hover.enabled = true;
        }
    },

    // Display menu options based on the current animation state
    menu: function()
    {
        if(animate.element)
        {
            $('.element-selected').removeClass('hidden');
        }
        else
        {
            $('.element-selected').addClass('hidden');
        }
    },

    start: function()
    {
        $('.workspace').addClass('highlight-content');
        animate.active = true;
        helper.storage.update = false;
    },

    stop: function()
    {
        $('.workspace').removeClass('highlight-content');
        animate.active = false;
        animate.element = false;
        animate.object = false;
        helper.storage.update = true;

        $('.menu .animate .element').text(animate.defaultText);
    }
};

module.exports = animate;
