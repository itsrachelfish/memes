var $ = require('wetfish-basic');
var storage = require('../app/storage');
var overlay = require('./overlay');
var helper = require('../app/helper');

var slides =
{
    editing: false,

    init: function()
    {
        slides.template = $('.slide.hidden').clone();
        $(slides.template).removeClass('hidden');

        $('.slides').on('overlay-opened', function()
        {
            slides.populate();
        });

        $('.slide-edit').on('overlay-opened', function()
        {
            // Populate modal title
            $('.slide-edit .number').text('' + slides.editing);

            // Populate form content
            var project = storage.get();
            var slide = project.slides[slides.editing - 1];
            var form = '.slide-edit form';

            // Make sure default values are set
            slide.desc = slide.desc || '';
            slide.autoplay = slide.autoplay || {'enabled': false};
            slide.transition = slide.transition || {'enabled': false};

            $(form).find('input[name="desc"]').value(slide.desc);
            $(form).find('input[name="autoplay"]').prop('checked', slide.autoplay.enabled).trigger('change', {bubbles: true});
            $(form).find('input[name="duration"]').value(slide.autoplay.duration);
            $(form).find('input[name="goto"]').value(slide.autoplay.goto);
            $(form).find('input[name="transition"]').prop('checked', slide.transition.enabled).trigger('change', {bubbles: true});
            $(form).find('input[name="transition-duration"]').value(slide.transition.duration);
        });

        $('.slides .create').on('click', function()
        {
            storage.slide.create();
        });

        $('.slides .copy').on('click', function()
        {
            var slide = parseInt(storage.get('slide'));
            storage.slide.copy(slide);
        });

        // Refresh which slides are displayed
        $('.workspace').on('slides-changed', function()
        {
            slides.populate();
        });

        $('body').on('click', '.slide-edit .view-all', function()
        {
            overlay.close('.slide-edit');
            overlay.open('.slides');
        });

        $('body').on('click change', '.slide-edit .autoplay', function()
        {
            if($(this).prop('checked'))
            {
                $('.slide-edit .use-autoplay').removeClass('hidden');
            }
            else
            {
                $('.slide-edit .use-autoplay').addClass('hidden');
            }
        });

        $('body').on('click change', '.slide-edit .transition', function()
        {
            if($(this).prop('checked'))
            {
                $('.slide-edit .use-transition').removeClass('hidden');
            }
            else
            {
                $('.slide-edit .use-transition').addClass('hidden');
            }
        });

        $('body').on('submit', '.slide-edit form', function(event)
        {
            event.preventDefault();

            var input = helper.serialize(this);
            var options =
            {
                desc: input['desc'],
                autoplay:
                {
                    enabled: input['autoplay'],
                    duration: input['duration'],
                    goto: input['goto'],
                },
                transition:
                {
                    enabled: input['transition'],
                    duration: input['transition-duration'],
                },
            };

            storage.slide.save(options);

            overlay.close('.slide-edit');
            overlay.open('.slides');
        });
    },

    // Populate the list of slides
    populate: function()
    {
        // Clear any previous slides
        $('.slide-list .slide').remove();

        // Get the current project data
        var project = storage.get();

        project.slides.forEach(function(slide, index)
        {
            var template = $(slides.template).clone();

            if(index == project.slide)
            {
                $(template).addClass('active');
            }

            var objects = 0;

            for(var property in slide)
            {
                if(typeof slide[property] === "object" && slide[property].content)
                {
                    objects++;
                }
            }

            if(slide.desc)
            {
                $(template).find('.desc').text(slide.desc);
            }
            else
            {
                $(template).find('.desc').text('');
            }

            $(template).find('.title .text').text('Slide ' + (index + 1));
            $(template).find('.objects').text(objects + ' objects');

            // When clicking on the slide itself
            $(template).on('click', slides.click);

            // When clicking on a slide icon
            $(template).find('.edit').on('click', slides.edit);
            $(template).find('.delete').on('click', slides.delete);

            // When dragging the move icon
            $(template).dragondrop({'handle': '.move', 'position': 'static'});
            $(template).on('dragend', slides.move);

            $('.slide-list').el[0].appendChild(template);
        });
    },

    click: function(event)
    {
        // Switch the slide to whichever one was clicked on
        var index = $(this).index();
        storage.slide.goto(index);
    },

    edit: function(event)
    {
        event.stopPropagation();

        slides.editing = $(event.target).parents('.dragon').index() + 1;

        overlay.close('.slides');
        overlay.open('.slide-edit');
    },

    move: function(event)
    {
        var index = event.detail;
        storage.slide.move(index.old, index.new);
    },

    delete: function(event)
    {
        event.stopPropagation();

        var sure = confirm("Are you sure you want to delete this entire slide?");

        if(sure)
        {
            var index = $(this).parents('.slide').index();
            storage.slide.delete(index);
        }
    },
};

module.exports = slides;
