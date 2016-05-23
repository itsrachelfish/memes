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
        camera: false,
        frame: 0,
        frames: [],
        objects: {},
    },

    data: {}
};

// Public object with data manipulation functions
var storage =
{
    // Initialize any saved project data when the page loads
    init: function()
    {
        // Check local storage for any saved data
        var data = localStorage.getItem('project');

        if(data)
        {
            project.data = JSON.parse(localStorage.getItem('project'));
        }
        else
        {
            // Use default project data if none is found
            project.data = storage.create();
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

        // If there is saved data for the current frame
        if(project.data.frames[project.data.frame] !== undefined)
        {
            var frame = project.data.frames[project.data.frame];

            if(frame.background)
            {
                create.background(frame.background);
            }

            for(var id in frame)
            {
                if(project.data.objects[id] !== undefined)
                {
                    // Combine any additional frame data with the saved element's options
                    var options = extend(true, project.data.objects[id], frame[id]);
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
                        created = presets[options.preset].create(options);
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

        // Position
        var position = $(element).position();

        // any custom classes / effects?
        // if the element is hidden?
        // rotation???
        // custom styles?
        // z-index???

        var data =
        {
            'position':
            {
                'top': position.top,
                'left': position.left
            }
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
        if(text)
        {
            project.data.title = text;
        }

        $('title').text(project.data.title);
        $('.file .title').value(project.data.title);

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
        // Start by clearing out the storage
        storage.reset();

        var reader = new FileReader();
        reader.readAsText(file);

        reader.onload = function(event)
        {
            try
            {
                project.data = JSON.parse(reader.result);
            }
            catch(error)
            {
                project.data = storage.create();
                alert('There was an error loading your save file. Make sure it is valid JSON!');
            }

            storage.load();
            storage.persist();
        }
    },

    reset: function()
    {
        project.data = storage.create();
        $('.workspace').html('');
        $('body').attr('style', false);
        storage.persist();
    }
};

module.exports = storage;
