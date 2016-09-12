var $ = require('wetfish-basic');
var storage = require('../app/storage');
var overlay = require('./overlay');


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
            // lol typecasting
            $('.slide-edit .number').text('' + slides.editing);
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

        $('.slide-list .slide.active').removeClass('active');
        $(this).addClass('active');
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
