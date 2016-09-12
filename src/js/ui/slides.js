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
            if(slide.autoplay === undefined)
            {
                slide.autoplay = {'enabled': false};
            }

            if(slide.transition === undefined)
            {
                slide.transition = {'enabled': false};
            }

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

        project.slides.forEach(function(data, index)
        {
            var slide = $(slides.template).clone();

            if(index == project.slide)
            {
                $(slide).addClass('active');
            }

            var objectCount = Object.keys(data).length;

            if(data.background !== undefined)
            {
                objectCount--;
            }

            if(data.desc)
            {
                $(slide).find('.desc').text(data.desc);
            }
            else
            {
                $(slide).find('.desc').text('');
            }

            $(slide).find('.title .text').text('Slide ' + (index + 1));
            $(slide).find('.objects').text(objectCount + ' objects');

            // When clicking on the slide itself
            $(slide).on('click', slides.click);

            // When clicking on a slide icon
            $(slide).find('.edit').on('click', slides.edit);
            $(slide).find('.delete').on('click', slides.delete);

            // When dragging the move icon
            $(slide).dragondrop({'handle': '.move', 'position': 'static'});
            $(slide).on('dragend', slides.move);

            $('.slide-list').el[0].appendChild(slide);
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
