//
// This file handles saving data from localstorage and loading content on refresh
//
//////////////////////////////////////////////////

// Load wetfish basic
var $ = require('wetfish-basic');

// Load other stuff
var extend = require('extend');
var helper = require('./helper');
var create = require('./create');
var presets = require('./presets');

// Private object which stores the current project data in memory
var project =
{
    // Default data assigned to all new projets
    defaults:
    {
        title: 'Untitled Project',
        author: 'Anonymous',
        camera: false,
        slide: 0,
        slides: [{}],
        objects: {},
    },

    data: {}
};

var playing = false;
var timeout = {};
var animations = [];

// Public object with data manipulation functions
var storage =
{
    // Initialize any saved project data when the page loads
    init: function(config)
    {
        // Check local storage for any saved data
        var data = localStorage.getItem('project');

        if(data)
        {
            project.data = JSON.parse(localStorage.getItem('project'));
        }
        else
        {
            if(config.autoload.enabled)
            {
                // If autoload is enabled
                project.data = config.autoload.data;
            }
            else
            {
                // Otherwise load a blank project
                project.data = storage.create();
            }
        }

        storage.load();
    },

    // Create a new project from default settings
    create: function()
    {
        var output = project.defaults;
        output.created = new Date();
        output.modified = new Date();

        return output;
    },

    // Persist project data to local storage
    persist: function()
    {
        project.data.modified = new Date();
        localStorage.setItem('project', JSON.stringify(project.data));
    },

    // Load saved data onto the page
    load: function()
    {
        // Set the title of the page
        storage.title();

        // Set the author
        storage.author();

        if(project.data.camera)
        {
            $('.start-webcam').trigger('click');
        }

        // If there is saved data for the current slide
        if(project.data.slides[project.data.slide] !== undefined)
        {
            var slide = project.data.slides[project.data.slide];

            if(slide.background)
            {
                create.background(slide.background);
            }
            else
            {
                $('body').attr('style', false);
            }

            // Mark all content as pending deletion
            $('.workspace .content').addClass('pending-deletion');

            for(var id in slide)
            {
                if(project.data.objects[id] !== undefined)
                {
                    // Combine any additional slide data with the saved element's options
                    var options = extend(true, {}, project.data.objects[id], slide[id]);
                    var exists = $('#' + id);

                    // If the element already exists on the page
                    if(exists.el.length)
                    {
                        // Update the existing element
                        create.element(exists.el[0], options);
                        exists.removeClass('pending-deletion');
                    }

                    // Otherwise create a new one
                    else
                    {
                        var created = false;

                        if(options.type == 'image')
                        {
                            created = create.image(options);
                        }
                        else if(options.type == 'audio')
                        {
                            created = create.audio(options);
                        }
                        else if(options.type == 'video')
                        {
                            created = create.video(options);
                        }
                        else if(options.type == 'headline')
                        {
                            created = create.headline(options);
                        }
                        else if(options.type == 'text')
                        {
                            created = create.text(options);
                        }
                        else if(options.type == 'preset' && presets[options.preset] !== undefined)
                        {
                            presets[options.preset].init();
                            created = presets[options.preset].create(null, options);
                        }
                        else
                        {
                            console.log("Object '" + id + "' failed to load, no handler function matched.");
                        }

                        // If an element was created
                        if(created)
                        {
                            // Add the unique ID to the DOM
                            $(created.element).attr('id', id);
                        }
                    }
                }
            }

            // Remove all remaining elements pending deletion
            $('.workspace .content.pending-deletion').remove();
        }
    },

    // Save a new object in storage
    save: function(element, options)
    {
        // Check if this element has a unique ID
        var id = $(element).attr('id') || helper.randomString();
        $(element).attr('id', id);

        // Check if this element exists on multiple slides
        var count = 0;

        project.data.slides.forEach(function(slide)
        {
            if(slide[id] !== undefined)
            {
                count++;
            }
        });

        // If it does, display a warning message
        if(count > 1)
        {
            var confirmed = confirm("This object exists across multiple slides. Using the edit tool will modify the object on every slide. Click 'OK' if this is what you want to do, or 'Cancel' to create a new copy on this slide.");

            if(!confirmed)
            {
                // Delete original object from this slide
                delete project.data.slides[project.data.slide][id];

                // Genereate a new ID for this object
                id = helper.randomString();
                $(element).attr('id', id);

                // Continue saving as normal...
            }
        }

        // Remove slide-specific data from saved options
        delete options.transform;
        delete options.layer;

        project.data.objects[id] = options;

        if(project.data.slides[project.data.slide] === undefined)
        {
            project.data.slides[project.data.slide] = {};
        }

        project.data.slides[project.data.slide][id] = {};
        storage.update(element);
    },

    // Update information from the DOM about an object in storage
    update: function(element, slide)
    {
        if(slide === undefined)
        {
            slide = project.data.slide;
        }

        // Check if this element has a unique ID
        var id = $(element).attr('id');

        // We can't update something without an ID
        if(!id)
        {
            return;
        }

        // any custom classes / effects?
        // if the element is hidden?
        // custom styles?

        if(helper.storage.update !== false)
        {
            // Use stringify / parse to make sure the saved data is passed by value, not by reference
            var data = JSON.parse(JSON.stringify(
            {
                'content': true,

                // Save any transformations
                'transform': element.transform,

                // Save what layer the element is on
                'layer': $(element).style('z-index')
            }));

            // Check if any animations have already been saved for this object in this slide
            if(project.data.slides[slide][id] && project.data.slides[slide][id].animations)
            {
                data.animations = project.data.slides[slide][id].animations;
            }

            project.data.slides[slide][id] = data;
            storage.persist();
        }

        $('.workspace').trigger('content-updated', element);
    },

    animation:
    {
        save: function(element, name, data)
        {
            // Check if this element has a unique ID
            var id = $(element).attr('id');

            // We can't animate something without an ID
            if(!id)
            {
                return;
            }

            if(project.data.objects[id].animation === undefined)
            {
                project.data.objects[id].animation = {};
            }

            // If the animation is playing
            if(data.playing !== undefined)
            {
                if(project.data.slides[project.data.slide][id].animations === undefined)
                {
                    project.data.slides[project.data.slide][id].animations = [];
                }

                var index = project.data.slides[project.data.slide][id].animations.indexOf(name);
                
                // Save the playback state in the data for the current slide
                if(data.playing)
                {
                    if(index == -1)
                    {
                        project.data.slides[project.data.slide][id].animations.push(name);
                    }
                }
                else
                {
                    if(index != -1)
                    {
                        project.data.slides[project.data.slide][id].animations.splice(index, 1);
                    }
                }

                delete data.playing;
            }

            project.data.objects[id].animation[name] = data;
            storage.persist();
        },

        play: function()
        {
            // Loop through all objects in the current slide
            var slide = project.data.slides[project.data.slide];

            for(var id in slide)
            {
                if(project.data.objects[id] !== undefined)
                {
                    var element = $('#' + id).el[0];
                    var object = project.data.objects[id];

                    // Loop through all animations for this object start them
                    if(slide[id].animations && slide[id].animations.length)
                    {
                        slide[id].animations.forEach(function(name)
                        {
                            var frames = [];
                            var animation = object.animation[name];

                            animation.frames.forEach(function(frame)
                            {
                                frames.push(frame.computed);
                            });

                            var iterations = animation.iterations;

                            if(iterations == "Infinity")
                            {
                                iterations = Infinity;
                            }

                            $(element).addClass('animating');
                            animations.push({'element': element, 'animation': element.animate({'transform': frames}, {'duration': animation.duration, 'iterations': iterations, 'fill': 'forwards'})});
                        });
                    }
                }
            }
        },

        stop: function()
        {
            // Loop through all animations and cancel them
            animations.forEach(function(saved)
            {
                $(saved.element).removeClass('animating');
                saved.animation.cancel();
            });
        },

        delete: function(element, name)
        {
            // Check if this element has a unique ID
            var id = $(element).attr('id');

            // We can't animate something without an ID
            if(!id)
            {
                return;
            }

            // If there are no animations, we can't delete anything
            if(project.data.objects[id].animation === undefined)
            {
                return;
            }

            delete project.data.objects[id].animation[name];
            storage.persist();
        }
    },

    // Update the background of the current slide
    background: function(data)
    {
        project.data.slides[project.data.slide].background = data;
        storage.persist();
    },

    // Update the title of the project
    title: function(text)
    {
        if(text !== undefined)
        {
            project.data.title = text;
            storage.persist();
        }

        $('title').text(project.data.title);
        $('.file .title').value(project.data.title);
    },

    author: function(text)
    {
        if(text !== undefined)
        {
            project.data.author = text;
            storage.persist();
        }

        $('.file .author').value(project.data.author);
    },

    camera: function(recording)
    {
        recording = recording ? true : false;
        project.data.camera = recording;
        storage.persist();
    },

    // Remove an obejct
    remove: function(element)
    {
        // Check if this element has a unique ID
        var id = $(element).attr('id');

        // We can't remove something without an ID
        if(!id)
        {
            return;
        }

        // Selete this object from the current slide
        delete project.data.slides[project.data.slide][id];

        // Check how many other slides this object appears on
        var slides = 0;

        project.data.slides.forEach(function(slide)
        {
            if(slide[id])
            {
                slides++;
            }
        });

        // Only delete this object if it doesn't exist in any other slides
        if(!slides)
        {
            delete project.data.objects[id];
        }

        storage.persist();
    },

    // Calculate total localstorage usage
    usage: function()
    {

    },

    saveToFile: function()
    {
        var saveWindow = window.open();
        saveWindow.document.write('<body><pre>' + JSON.stringify(project.data, null, '    ') + '</pre></body>');
        saveWindow.document.close();
    },

    loadFromFile: function(file)
    {
        var reader = new FileReader();
        reader.readAsText(file);

        reader.onload = function(event)
        {
            var data = false;

            try
            {
                data = JSON.parse(reader.result);
            }
            catch(error)
            {
                alert('There was an error loading your save file. Make sure it is valid JSON!');
                console.log(file, reader, error);
            }

            // Only reset the page if a file was successfully loaded
            if(data)
            {
                storage.reset();
                project.data = data;

                storage.load();
                storage.persist();
            }
        }
    },

    // Get data from the project
    get: function(property)
    {
        // If a specific property was passed
        if(property)
        {
            // Get data about the background from the current slide
            if(property == 'background')
            {
                if(project.data.slides[project.data.slide] !== undefined)
                {
                    return project.data.slides[project.data.slide].background;
                }

                return false;
            }
            else
            {
                return project.data[property];
            }
        }

        // Default to returning the entire project
        return project.data;
    },

    // Get data about a specific object
    getObject: function(id)
    {
        if(project.data.objects[id] === undefined)
        {
            return;
        }

        var slide = project.data.slides[project.data.slide];
        var options = extend(true, {}, project.data.objects[id], slide[id]);

        return options;
    },

    reset: function()
    {
        project.data = storage.create();
        $('.workspace').html('');
        $('body').attr('style', false);
        storage.persist();
    },

    slide:
    {
        // Create a new slide
        create: function()
        {
            project.data.slides.splice(project.data.slide + 1, 0, {});
            storage.persist();

            $('.workspace').trigger('slides-changed');
        },

        // Copy an existing slide
        //  index - slide to copy
        //  destination - (optional) place it should be copied too
        //  remove - (optional) remove the original slide after copying it
        copy: function(index, destination, remove)
        {
            // If there's no specific destination, put the copy after the current
            if(typeof destination != "number")
            {
                destination = index + 1;
            }

            // Use stringify / parse to make sure the saved data is passed by value, not by reference
            var slide = JSON.parse(JSON.stringify(project.data.slides[index]));

            if(remove)
            {
                // Remove the original slide
                project.data.slides.splice(index, 1);
            }

            // Create a new slide from the saved data
            project.data.slides.splice(destination, 0, slide);

            // Redraw the project
            storage.load();
            storage.persist();

            $('.workspace').trigger('slides-changed');
        },

        // Save slide options
        save: function(options)
        {
            if(typeof options.desc === "string")
            {
                project.data.slides[project.data.slide].desc = options.desc;
            }

            if(typeof options.autoplay === "object")
            {
                project.data.slides[project.data.slide].autoplay = options.autoplay;
            }

            if(typeof options.transition === "object")
            {
                project.data.slides[project.data.slide].transition = options.transition;
            }

            storage.persist();
        },

        // Delete a slide
        delete: function(index)
        {
            project.data.slides.splice(index, 1);

            if(index > 0)
            {
                project.data.slide = index - 1;
            }
            else
            {
                // Make sure there is always 1 slide left
                if(project.data.slides.length === 0)
                {
                    storage.slide.create();
                }
            }

            // Redraw the project
            storage.load();
            storage.persist();

            $('.workspace').trigger('slides-changed');
        },

        // Switch to another slide
        goto: function(index)
        {
            // Make sure it's a number
            index = parseInt(index);

            // If the requested index is negative, use the first one
            if(index < 0)
            {
                index = 0;
            }

            // If the index is higher than the last slide
            else if(index >= project.data.slides.length)
            {
                // Are we in playback mode?
                if(playing)
                {
                    // Play the credits
                    $('.menu .credits').trigger('click');
                    return;
                }
                // Otherwise, use the last slide
                else
                {
                    index = project.data.slides.length - 1;
                }
            }

            project.data.slide = index;

            // Redraw the project
            storage.load();
            storage.persist();

            // Start animations after loading this slide if we are currently in playback mode
            if(playing)
            {
                storage.slide.play();
            }

            $('.workspace').trigger('slides-changed');
        },

        // Move an existing slide to a new position
        move: function(oldIndex, newIndex)
        {
            if(project.data.slides[oldIndex])
            {
                storage.slide.copy(oldIndex, newIndex, 'delete');
                $('.workspace').trigger('slides-changed');

                return true;
            }

            return false;
        },

        play: function()
        {
            if(!playing || !timeout.nextSlide)
            {
                playing = true;
                $('body').style({'overflow': 'hidden'});
                storage.animation.play();
                storage.media.play();

                // Check if the current slide should play
                var slide = project.data.slides[project.data.slide];

                if(slide.autoplay && slide.autoplay.enabled)
                {
                    if(slide.transition.enabled)
                    {
                        var transitionDuration = parseFloat(slide.transition.duration);

                        if(isNaN(transitionDuration))
                        {
                            transitionDuration = 0.3;
                        }

                        $('.content').style({'transition': 'all ' + transitionDuration + 's'});
                    }
                    else
                    {
                        $('.content').style({'transition': 'none'});
                    }

                    timeout.nextSlide = setTimeout(function()
                    {
                        var next = parseInt(slide.autoplay.goto);

                        // Play next slide if no goto is provided
                        if(isNaN(next))
                        {
                            next = project.data.slide + 1;
                        }
                        // Subtract 1 from the goto frame because of 0 indexing
                        else
                        {
                            next--;
                        }

                        delete timeout.nextSlide;
                        storage.animation.stop();
                        storage.slide.goto(next);

                    }, slide.autoplay.duration * 1000);
                }
            }
        },

        pause: function()
        {
            if(playing)
            {
                $('body').style({'overflow': 'auto'});

                playing = false;
                clearTimeout(timeout.nextSlide);
                delete timeout.nextSlide;
                storage.animation.stop();
                storage.media.stop();

                $('.content').style({'transition': 'none'});
            }
        },

        status: function()
        {
            if(playing)
            {
                return 'playing';
            }

            return 'paused';
        }
    },

    // Functions to control playback of media elements (audio / video)
    media:
    {
        play: function()
        {
            // Loop through all objects in the current slide
            var slide = project.data.slides[project.data.slide];

            for(var id in slide)
            {
                if(project.data.objects[id] !== undefined)
                {
                    var element = $('#' + id).el[0];
                    var object = project.data.objects[id];

                    if(object.autoplay)
                    {
                        $(element).find('audio, video').el[0].play();
                    }
                }
            }
        },

        stop: function()
        {
            $('.workspace audio, .workspace video').each(function()
            {
                this.pause();
            });
        }
    },

    isPlaying: function()
    {
        return playing;
    }
};

module.exports = storage;
