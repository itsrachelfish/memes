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
        frame: 0,
        frames: [{}],
        objects: {},
    },

    data: {}
};

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

        // If there is saved data for the current frame
        if(project.data.frames[project.data.frame] !== undefined)
        {
            var frame = project.data.frames[project.data.frame];

            if(frame.background)
            {
                create.background(frame.background);
            }
            else
            {
                $('body').attr('style', false);
            }

            // Mark all content as pending deletion
            $('.workspace .content').addClass('pending-deletion');

            for(var id in frame)
            {
                if(project.data.objects[id] !== undefined)
                {
                    // Combine any additional frame data with the saved element's options
                    var options = extend(true, project.data.objects[id], frame[id]);
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

        project.data.objects[id] = options;

        if(project.data.frames[project.data.frame] === undefined)
        {
            project.data.frames[project.data.frame] = {};
        }

        project.data.frames[project.data.frame][id] = {};
        storage.update(element);
    },

    // Update information from the DOM about an object in storage
    update: function(element)
    {
        // Check if this element has a unique ID
        var id = $(element).attr('id');

        // We can't remove something without an ID
        if(!id)
        {
            return;
        }

        // any custom classes / effects?
        // if the element is hidden?
        // custom styles?

        var data =
        {
            // Save the element's position
            'position':
            {
                'left': parseFloat(element.transform.translate[0]), // Because wetfish basic is awesome <3
                'top': parseFloat(element.transform.translate[1])
            },

            // Save any transformations
            'transform': element.transform,

            // Save what layer the element is on
            'layer': $(element).style('z-index')
        };

        project.data.frames[project.data.frame][id] = data;
        storage.persist();
    },

    // Update the background of the current frame
    background: function(data)
    {
        project.data.frames[project.data.frame].background = data;
        storage.persist();
    },

    // Update the title of the project
    title: function(text)
    {
        if(text !== undefined)
        {
            project.data.title = text;
        }

        $('title').text(project.data.title);
        $('.file .title').value(project.data.title);

        storage.persist();
    },

    author: function(text)
    {
        if(text !== undefined)
        {
            project.data.author = text;
        }

        $('.file .author').value(project.data.author);
        storage.persist();
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

        delete project.data.frames[project.data.frame][id];
        delete project.data.objects[id];

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
            // Get data about the background from the current frame
            if(property == 'background')
            {
                if(project.data.frames[project.data.frame] !== undefined)
                {
                    return project.data.frames[project.data.frame].background;
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

        var frame = project.data.frames[project.data.frame];
        var options = extend(true, project.data.objects[id], frame[id]);

        return options;
    },

    reset: function()
    {
        project.data = storage.create();
        $('.workspace').html('');
        $('body').attr('style', false);
        storage.persist();
    },

    frame:
    {
        // Create a new frame
        create: function()
        {
            project.data.frames.splice(project.data.frame + 1, 0, {});
            storage.persist();

            $('.workspace').trigger('frames-changed');
        },

        // Copy an existing frame
        copy: function(index)
        {
            project.data.frames.splice(index + 1, 0, project.data.frames[index]);
            storage.persist();

            $('.workspace').trigger('frames-changed');
        },

        // Delete a frame
        delete: function(index)
        {
            project.data.frames.splice(index, 1);

            if(index > 0)
            {
                project.data.frame = index - 1;
            }
            else
            {
                // Make sure there is always 1 frame left
                if(project.data.frames.length === 0)
                {
                    storage.frame.create();
                }
            }

            // Redraw the project
            storage.load();
            storage.persist();

            $('.workspace').trigger('frames-changed');
        },

        // Switch to another frame
        goto: function(index)
        {
            // Make sure it's a number
            index = parseInt(index);

            // If the requested index is negative, use the first one
            if(index < 0)
            {
                index = 0;
            }

            // If the index is higher than the last frame, use the last frame
            else if(index >= project.data.frames.length)
            {
                index = project.data.frames.length - 1;
            }

            project.data.frame = index;

            // Redraw the project
            storage.load();
        },
    },
};

module.exports = storage;
