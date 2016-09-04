var $ = require('wetfish-basic');
var helper = require('../app/helper');
var storage = require('../app/storage');
var tools = require('../app/tools');
var transform = require('../plugins/transform');
var explode = require('../plugins/explode');

// Module which controls the menus that appear when hovering over content
var hover =
{
    tool: 'move',

    init: function()
    {
        // Create a clone of the hover menu html template
        var baseTemplate = $('.hover-menu.hidden').clone();
        $(baseTemplate).removeClass('hidden').addClass('active');

        // Save it for later
        hover.baseTemplate = baseTemplate;

        // Loop through any existing workspace content
        $('.workspace .content').each(function()
        {
            $(this).on('mouseenter', function(event)
            {
                hover.start(event.target);
            });
        });

        // Bind to the creation of new content
        $('.workspace').on('content-created', function(event)
        {
            $(event.detail).on('mouseenter', function(event)
            {
                hover.start(event.target);
            });
        });

        $('.workspace').on('click', '.hover-menu .icon, .hover-menu .icon *', function()
        {
            var element = this;

            // If the user clicks on the font icon instead of the wrapper element
            if(!$(this).hasClass('icon'))
            {
                element = $(this).parents('.icon').el[0];
            }

            // Update the menu currently on the page
            $('.hover-menu .icon.active').removeClass('active');
            $(element).addClass('active');

            hover.tool = $(element).data('tool');

            // Update the saved menu template
            $(hover.baseTemplate).find('.icon.active').removeClass('active');
            $(hover.baseTemplate).find('.icon[data-tool="'+hover.tool+'"]').addClass('active');

            hover.initTools();
            hover.showControls();
        });

        $('.workspace').on('click', '.hover-menu .play, .hover-menu .play *', function()
        {
            console.log('wwwwwwwww');
            $(hover.element).find('audio, video').el[0].play();
        });

        $('.workspace').on('click', '.hover-menu .pause, .hover-menu .pause *', function()
        {
            $(hover.element).find('audio, video').el[0].pause();
        });

        // Bind to media (audio / video) events
        document.addEventListener('play', function(event)
        {
            var parent = $(event.target).parents('.content').el[0];

            if(parent == hover.element)
            {
                $(hover.template).find('.controls .pause').removeClass('hidden');
                $(hover.template).find('.controls .play').addClass('hidden');
            }
        }, true);

        document.addEventListener('pause', function(event)
        {
            var parent = $(event.target).parents('.content').el[0];

            if(parent == hover.element)
            {
                $(hover.template).find('.controls .play').removeClass('hidden');
                $(hover.template).find('.controls .pause').addClass('hidden');
            }
        }, true);

        document.addEventListener('timeupdate', function(event)
        {
            var parent = $(event.target).parents('.content').el[0];

            if(parent == hover.element)
            {
                $(hover.template).find('.controls progress').attr('max', event.target.duration);
                $(hover.template).find('.controls progress').value(event.target.currentTime);
            }
        }, true);
    },
    
    start: function(element)
    {
        hover.element = element;

        // Make a clone of the default hover template
        var template = $(hover.baseTemplate).clone();
        hover.template = template;

        // Get information about the current object
        var zindex = parseInt($(element).style('z-index'));
        var size = $(element).size();

        // Make sure no other menus are still active
        hover.stop();

        $(template).style({'height': size.height + 'px', 'width': size.width + 'px', 'z-index': zindex});
        $(template).transform(element.transform);

        $(template).on('click', function(event)
        {
            // Only trigger click when clicking on the menu content (not the menu icons)
            if($(event.target).hasClass('hover-menu'))
            {
                if(hover.tool == 'interact')
                {
                    tools.interact(hover.element);
                }
                else if(hover.tool == 'edit')
                {
                    tools.edit(hover.element);
                }
                else if(hover.tool == 'delete')
                {
                    storage.remove(hover.element);
                    $(template).remove();

                    if(helper.pressed.control)
                    {
                        explode(hover.element);
                    }
                    else
                    {
                        $(hover.element).remove();
                    }
                }
            }
        });

        $(template).on('mouseleave', function()
        {
            hover.stop();
        });

        // Ensure the element being dragged is always on top
        $(template).on('dragstart', function()
        {
            helper.layers++
            $(template).style({'z-index': helper.layers});
            $(element).style({'z-index': helper.layers});

            // Disable pointer-events on content while dragging
            $('.workspace .content').style({'pointer-events': 'none'})
        });

        $(template).on('dragmove', function()
        {
            $(element).transform(template.transform);
        });

        $(template).on('dragend', function()
        {
            storage.update(element);

            // Re-enable pointer-events
            $('.workspace .content').style({'pointer-events': 'auto'})
        });

        $(element).on('transformed', function(evet)
        {
            $(template).transform(element.transform);
        });

        hover.showControls();

        $(template).dragondrop();
        $('.workspace').el[0].appendChild(template);

        hover.initTools();
    },

    stop: function()
    {
        // Prevent removing menus while dragging (this can happen if you move the mouse too quickly)
        if($('.hover-menu.active').hasClass('dragging'))
        {
            return;
        }

        // Remove any active menus
        $('.hover-menu.active').remove();

        transform.stop();
    },

    // Show controls based on the options available to different types of objects
    showControls: function()
    {
        // Get information about the current object
        var id = $(hover.element).attr('id');
        var object = storage.getObject(id);

        // Map of icons sorted by type
        var icons =
        {
            image: ['edit', 'move', 'transform', 'delete'],
            audio: ['interact', 'edit', 'move', 'transform', 'delete'],
            video: ['interact', 'edit', 'move', 'transform', 'delete'],
            text: ['edit', 'move', 'transform', 'delete'],
            preset: ['interact', 'move', 'transform', 'delete']
        }

        $(hover.template).find('.icon').addClass('hidden');

        if(Array.isArray(icons[object.type]))
        {
            icons[object.type].forEach(function(icon)
            {
                $(hover.template).find('.icon[data-tool="'+ icon +'"]').removeClass('hidden');
            });
        }

        if(object.controls && hover.tool == "interact")
        {
            $(hover.template).find('.controls').removeClass('hidden');
        }
        else
        {
            $(hover.template).find('.controls').addClass('hidden');
        }

        return hover.template;
    },

    initTools: function()
    {
        if(hover.tool == "move")
        {
            $('.hover-menu.active').removeClass('disabled');
        }
        else
        {
            $('.hover-menu.active').addClass('disabled');
        }

        if(hover.tool == "transform")
        {
            transform.start(hover.element);
        }
        else
        {
            transform.stop();
        }

        if($(hover.element).hasClass('audio-wrap video-wrap', 'or'))
        {
            $(hover.template).find('.controls progress').attr('max', $(hover.element).find('.element').el[0].duration);
            $(hover.template).find('.controls progress').value($(hover.element).find('.element').el[0].currentTime);
        }
    }
};

module.exports = hover;
