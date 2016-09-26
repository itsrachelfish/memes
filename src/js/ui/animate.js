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
    iterations: Infinity,
    playing: false,

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
            animate.persist();
        });

        $('.animate .animations select').on('change', function(event)
        {
            var animation = $(this).value();

            // Only trigger when an actual animation is selected
            if(animation)
            {
                animate.name = animation;
                animate.frame = 0;
                animate.frames = animate.object.animation[animate.name].frames;

                $('.animation-selected').removeClass('hidden');

                $('#frame').value(0);
                $('#frame').attr('max', animate.frames.length - 1);

                if(animate.object.animation[animate.name].iterations == 'Infinity')
                {
                    $('.animate .loop').prop('checked', true);
                }
                else
                {
                    $('.animate .loop').prop('checked', false);
                }

                $('#duration').value(animate.object.animation[animate.name].duration).trigger('change');

                if(animate.object.animations.indexOf(animation) > -1)
                {
                    $('.animate .enabled').prop('checked', true).trigger('change');
                }
                else
                {
                    $('.animate .enabled').prop('checked', false).trigger('change');
                }

                animate.update();
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

            animate.persist();
        });

        $('#duration').on('input change', function()
        {
            animate.duration = parseInt($(this).value());
            animate.persist();
            animate.refresh();
        });

        $('#frame').on('input change', function()
        {
            // If the frame has changed and there is more than one frame
            if(animate.frame != $(this).value())
            {

                // Set the current time of the animation to match the value of the slider
                animate.frame = parseInt($(this).value());
                animate.update();
            }
        });

        // Delete an entire animation
        $('.animate .delete').on('click', function()
        {
            storage.animation.delete(animate.element, animate.name);
            animate.populate();
        });

        $('.animate .enabled').on('click change', function()
        {
            if(this.checked)
            {
                animate.play();
            }
            else
            {
                animate.pause();
            }

            animate.persist();
        });

        $('.animate .loop').on('click change', function()
        {
            if(this.checked)
            {
                animate.iterations = Infinity;
            }
            else
            {
                animate.iterations = 1;
            }

            animate.persist();
            animate.refresh();
        });

        $('.workspace').on('content-updated', function(event)
        {
            var updatedElement = event.detail;

            if(animate.element == updatedElement)
            {
                animate.persist();
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
            $('.animate select option').eq(0).prop('selected', true);

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
    persist: function()
    {
        // If the animation is not currently playing
        if(!animate.animation || (animate.animation && animate.animation.playState != 'running'))
        {
            // Get the current computed transform style
            var transform = $(animate.element).style('transform');

            // Update the saved animation object
            animate.frames[animate.frame] = JSON.parse(JSON.stringify({'computed': transform, 'basic': animate.element.transform}));
            animate.object.animation[animate.name] = animate.frames;
        }

        // Build object of data to be saved
        var data =
        {
            duration: animate.duration,
            iterations: animate.iterations,
            frames: animate.frames,
            playing: animate.playing
        };

        if(animate.iterations === Infinity)
        {
            data.iterations = 'Infinity';
        }

        storage.animation.save(animate.element, animate.name, data);
    },

    // Update animation element with the values of the current frame
    update: function()
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

            if(animate.animation)
            {
                animate.animation.cancel();
            }

            animate.animation = animate.element.animate({'transform': frames}, {'duration': animate.duration, 'iterations': animate.iterations, 'fill': 'forwards'});

            var durationPerFrame = animate.duration / (animate.frames.length - 1);
            var currentTime = durationPerFrame * animate.frame;

            if(currentTime > 1)
            {
                currentTime--;
            }

            animate.animation.currentTime = currentTime;
            helper.hover.enabled = false;
            animate.playing = true;
        }
        catch(exception)
        {
            console.log(exception);

            animate.animation = false;
            helper.hover.enabled = true;
            animate.playing = false;
        }
    },

    // Refresh animation if currently playing
    refresh: function()
    {
        if(animate.animation && animate.animation.playState == 'running')
        {
            animate.play();
        }
    },

    pause: function()
    {
        if(animate.animation)
        {
            animate.animation.cancel();
            helper.hover.enabled = true;
            animate.playing = false;
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
        $('.element-selected').addClass('hidden');
        $('.animation-selected').addClass('hidden');

        animate.pause();
        animate.active = false;
        animate.element = false;
        animate.object = false;
        helper.storage.update = true;

        $('.menu .animate .element').text(animate.defaultText);
    }
};

module.exports = animate;
