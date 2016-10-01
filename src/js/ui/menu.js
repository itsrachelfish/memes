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
var slides = require('./slides');
var animate = require('./animate');

// Global webcam object
var webcam;

function textToHex(text)
{
    var number = parseInt(text);
    var hex = number.toString(16);

    if(hex.length < 2)
    {
        return '0' + hex;
    }

    return hex;
}

function rgbToHex(text)
{
    var match = text.match(/^rgba?\s*\((.*?)\)/);

    if(match)
    {
        var colors = match[1].split(',');
        return '#' + textToHex(colors[0]) + textToHex(colors[1]) + textToHex(colors[2]);
    }

    // Return black if nothing was matched
    return '#000';
}

var menu =
{
    pickers: function()
    {
        $('.picker').each(function()
        {
            var rel = $(this).find('input').data('rel');
            var value = $(rel).value();

            // Add the color to a temporary hidden element
            var temporary = document.createElement('div');
            $(temporary).style({'color': value});

            // Get the computed color of the element (allows support for non-hex values)
            var color = rgbToHex(window.getComputedStyle(temporary).color);

            $(this).find('input').value(color);
        });
    },

    // Switch between different menu modes (which sections are displayed)
    mode: function(mode)
    {
        // Make sure hover menus are only enabled when in edit mode
        if(mode == 'edit')
        {
            helper.hover.enabled = true;
        }
        else
        {
            helper.hover.enabled = false;
        }

        $('.menu section').addClass('hidden');
        $('.menu section.' + mode).removeClass('hidden');
    },

    // Global menu event bindings when the page is loaded
    init: function()
    {
        slides.init();
        animate.init();

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

        $('.menu .toggle, .overlay .toggle').on('click', function()
        {
            var text = this.textContent;
            var toggle = $(this).data('toggle');
            var rel = $(this).data('rel');

            $(this).data('toggle', text);
            $(this).text(toggle);

            $(rel).toggle('hidden');

            // Save toggle value in localstorage
            var toggleState = localStorage.getItem('toggle') || '{}';
            toggleState = JSON.parse(toggleState);

            if($(rel).hasClass('hidden'))
            {
                toggleState[rel] = 1;
            }
            else
            {
                toggleState[rel] = 0;
            }

            localStorage.setItem('toggle', JSON.stringify(toggleState));
        });

        // Populate saved toggles on page load
        var toggleState = localStorage.getItem('toggle') || '{}';
        toggleState = JSON.parse(toggleState);

        Object.keys(toggleState).forEach(function(rel)
        {
            var hidden = toggleState[rel];

            if(hidden)
            {
                $(rel).addClass('hidden');
            }
            else
            {
                $(rel).removeClass('hidden');
            }
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

        var recording = false;

        // Webcam stuff
        $('.start-webcam').on('click', function()
        {
            if(!recording)
            {
                $(this).addClass('hidden');
                $('.stop-webcam').removeClass('hidden');

                storage.camera(true);
                webcam = new Webcam('.webcam');

                recording = true;
            }
        });

        $('.stop-webcam').on('click', function()
        {
            if(recording)
            {
                $(this).addClass('hidden');
                $('.start-webcam').removeClass('hidden');

                storage.camera(false);
                webcam.stop();
                $('.webcam').attr('src', '');

                recording = false;
            }
        });

        // Slideshow playback
        $('button.play').on('click', function()
        {
            $('button.play').addClass('hidden');
            $('button.pause').removeClass('hidden');

            storage.slide.play();
            menu.mode('play');
        });

        $('button.pause').on('click', function()
        {
            $('button.pause').addClass('hidden');
            $('button.play').removeClass('hidden');

            storage.slide.pause();
            menu.mode('edit');
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

        $('body').on('click change', '.headline.overlay .border', function()
        {
            if($(this).prop('checked'))
            {
                $('.headline.overlay .use-border').removeClass('hidden');
            }
            else
            {
                $('.headline.overlay .use-border').addClass('hidden');
            }
        });

        $('.headline.overlay form').on('submit', function(event)
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

            var headline = create.headline(options);
            storage.save(headline.element, headline.options);

            overlay.close('.headline');
        });

        $('.headline').on('overlay-opened', function()
        {
            menu.pickers();
        });

        // Populate saved information when the background overlay is opened
        $('.background').on('overlay-opened', function()
        {
            var background = storage.get('background');
            var form = '.background.overlay form';

            if(background)
            {
                // Add saved options into the form
                $(form).find('input[name="background"]').value(background.background);
                $(form).find('input[name="image"]').value(background.image);
                $(form).find('select[name="repeat"]').value(background.repeat);
                $(form).find('input[name="position"]').value(background.position);
            }

            menu.pickers();
        });

        // Populate color pickers on load
        menu.pickers();

console.log('uhhh', $('.picker'));

        $('.picker input').on('input change blur', function()
        {
            console.log('it changed?');

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
            var slide = parseInt(storage.get('slide'));

            if($(this).hasClass('next'))
            {
                storage.slide.goto(slide + 1);
            }
            else
            {
                storage.slide.goto(slide - 1);
            }
        });

        $('.menu button.animate').on('click', function()
        {
            menu.mode('animate');
            animate.start();
        });

        $('.menu .animate .cancel').on('click', function()
        {
            menu.mode('edit');
            animate.stop();
        });
    }
};

module.exports = menu;
