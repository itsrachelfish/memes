// Load wetfish basic
var $ = require('wetfish-basic');

// Load custom modules
var Webcam = require('../plugins/webcam');

var helper = require('../app/helper');
var create = require('../app/create');
var storage = require('../app/storage');
var presets = require('../app/presets');

var overlay = require('./overlay');
var credits = require('./credits');

// Global webcam object
var webcam;

var menu =
{
    pickers: function()
    {
        $('.picker').each(function()
        {

            var rel = $(this).find('input').data('rel');
            var value = $(rel).value();

            $(this).find('input').value(value);
        });
    },

    // Global menu event bindings when the page is loaded
    init: function()
    {
        // Make sure the menu is on top when you're mousing over it
        $('.menu').on('mouseenter touchstart', function()
        {
            $(this).style({'z-index': helper.layers + 1});
        });

        // Check if menu buttons open an overlay
        $('.menu button').on('click', function()
        {
            if($(this).data('overlay'))
            {
                // Make sure overlay titles are in "add mode"
                $('h1.add').removeClass('hidden');
                $('h1.edit').addClass('hidden');

                overlay.open($(this).data('overlay'));
            }
        });

        // Sub-overlay buttons from within the content overlay
        $('.content button').on('click', function()
        {
            if($(this).data('overlay'))
            {
                overlay.close();
                overlay.open($(this).data('overlay'));
            }
        });

        $('.menu .toggle').on('click', function()
        {
            var text = this.textContent;
            var toggle = $(this).data('toggle');
            var rel = $(this).data('rel');

            $(this).data('toggle', text);
            $(this).text(toggle);

            $(rel).toggle('hidden');
        });

        // Project file menu
        $('.file .new').on('click', function()
        {
            var sure = confirm("Are you sure you want to start a new project? Any unsaved changes will be lost.");

            if(sure)
            {
                storage.reset();
                overlay.close('.file');
            }
        });

        $('.file .save').on('click', function()
        {
            storage.saveToFile();
            overlay.close('.file');
        });

        $('.file .title').on('input change', function()
        {
            storage.title($(this).value());
        });

        $('.file .author').on('input change', function()
        {
            storage.author($(this).value());
        });

        $('.file .import').on('submit', function(event)
        {
            event.preventDefault();

            var sure = confirm("Are you sure you want to import a project? Any unsaved changes will be lost.");

            if(sure)
            {
                var file = $('.file .import input').el[0].files[0];

                if(file)
                {
                    storage.loadFromFile(file);
                    overlay.close('.file');
                }
                else
                {
                    alert('Failed to load import file! Make sure you have a file selected from your computer.');
                }
            }
        });

        // Populate created / modified dates when the file overlay is opened
        $('.file').on('overlay-opened', function()
        {
            var created = new Date(storage.get('created'));
            var modified = new Date(storage.get('modified'));

            $('.date-created').value(created.toLocaleDateString() + " - " + created.toLocaleTimeString());
            $('.date-modified').value(modified.toLocaleDateString() + " - " + modified.toLocaleTimeString());
        });

        // Webcam stuff
        $('.start-webcam').on('click', function()
        {
            $(this).addClass('hidden');
            $('.stop-webcam').removeClass('hidden');

            storage.camera(true);
            webcam = new Webcam('.webcam');
        });

        $('.stop-webcam').on('click', function()
        {
            $(this).addClass('hidden');
            $('.start-webcam').removeClass('hidden');

            storage.camera(false);
            webcam.stop();
            $('.webcam').attr('src', '');
        });

        // Slideshow playback
        $('.play').on('click', function()
        {
            $(this).addClass('hidden');
            $('.pause').removeClass('hidden');
        });

        $('.pause').on('click', function()
        {
            $(this).addClass('hidden');
            $('.play').removeClass('hidden');
        });

        $('.image.overlay form').on('submit', function(event)
        {
            event.preventDefault();
            var input = helper.serialize(this);

            if(helper.validate(input))
            {
                var image = create.image(input);

                // Save the new element in local storage
                storage.save(image.element, image.options);

                // Remove any temporary input fields (automatically generated under certain conditions, like when tools are used)
                $(this).find('.temporary').remove();

                overlay.close('.image');
            }
        });

        $('.audio.overlay form').on('submit', function(event)
        {
            event.preventDefault();
            var input = helper.serialize(this);

            if(helper.validate(input))
            {
                var audio = create.audio(input);
                storage.save(audio.element, audio.options);
                $(this).find('.temporary').remove();
                overlay.close('.audio');
            }
        });

        $('.video.overlay form').on('submit', function(event)
        {
            event.preventDefault();
            var input = helper.serialize(this);

            if(helper.validate(input))
            {
                var video = create.video(input);
                storage.save(video.element, video.options);
                $(this).find('.temporary').remove();
                overlay.close('.video');
            }
        });

        $('body').on('click change', '.text.overlay .border', function()
        {
            if($(this).prop('checked'))
            {
                $('.text.overlay .use-border').removeClass('hidden');
            }
            else
            {
                $('.text.overlay .use-border').addClass('hidden');
            }
        });

        $('.text.overlay form').on('submit', function(event)
        {
            event.preventDefault();
            var input = helper.serialize(this);
            var options =
            {
                text: input['text'],
                size: input['text-size'],
                color: input['text-color'],
                image: input['text-image'],
                border:
                {
                    enabled: input['border'],
                    size: input['border-size'],
                    color: input['border-color'],
                    image: input['border-image'],
                },

                // Special options only set when editing existing text
                id: input.id,
                saved: input.saved
            };

            // Remove any temporary input fields (automatically generated under certain conditions, like when tools are used)
            $(this).find('.temporary').remove();

            var text = create.text(options);
            storage.save(text.element, text.options);

            overlay.close('.text');
        });

        $('.text').on('overlay-opened', function()
        {
            menu.pickers();
        });

        // Populate saved information when the background overlay is opened
        $('.background').on('overlay-opened', function()
        {
            var background = storage.get('background');
            var form = '.background.overlay form';

            // Add saved options into the form
            $(form).find('input[name="background"]').value(background.background);
            $(form).find('input[name="image"]').value(background.image);
            $(form).find('select[name="repeat"]').value(background.repeat);
            $(form).find('input[name="position"]').value(background.position);

            menu.pickers();
        });

        // Populate color pickers on load
        menu.pickers();

        $('.picker input').on('input change blur', function()
        {
            var rel = $(this).data('rel');
            $(rel).value($(this).value());
        });

        $('.background.overlay form').on('submit', function(event)
        {
            event.preventDefault();
            var input = helper.serialize(this);

            create.background(input);
            storage.background(input);

            overlay.close('.background');
        });

        // Handler when buttons are clicekd in the presets menu
        $('.presets button').on('click', function()
        {
            var preset = $(this).data('preset');

            // If there is a handler object for this preset
            if(presets[preset] !== undefined)
            {
                // Does this preset need to be initialized?
                if(typeof presets[preset].init == "function")
                {
                    // Has it been?
                    if(presets.initialized[preset] === undefined)
                    {
                        presets[preset].init(this);
                        presets.initialized[preset] = true;
                    }
                }

                // Now call the create method
                var preset = presets[preset].create(this);
                storage.save(preset.element, preset.options);

                // And close the presets menu
                overlay.close('.presets');
            }
        });

        $('.menu .credits').on('click', function()
        {
            credits.show();
        });

        $('.credits-overlay').on('click', function()
        {
            credits.hide();
        });

        $('.menu .next, .menu .prev').on('click', function()
        {
            var frame = parseInt(storage.get('frame'));

            if($(this).hasClass('next'))
            {
                storage.frame(frame + 1);
            }
            else
            {
                storage.frame(frame - 1);
            }
        });
    }
};

module.exports = menu;
