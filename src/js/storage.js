//
// This file handles saving data from localstorage and loading content on refresh
//
//////////////////////////////////////////////////

// Load wetfish basic
var $ = require('wetfish-basic');

// Load other stuff
var helper = require('./helper');
var create = require('./element');
var presets = require('./presets');
var extend = require('extend');

// Private object which stores the current project data in memory
var project =
{
    // Default data assigned to all new projets
    defaults:
    {
        title: 'Untitled Project',
        camera: false,
        background: {},
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
            project.data = project.defaults;
        }

        storage.load();
    },

    // Load saved data onto the page
    load: function()
    {
        // If there is saved data for the current frame
        if(project.data.frames[project.data.frame] !== undefined)
        {
            var frame = project.data.frames[project.data.frame];

            for(var id in frame)
            {
                if(project.data.objects[id] !== undefined)
                {
                    // Combine any additional frame data with the saved element's options
                    var options = extend(true, project.data.objects[id], frame[id]);
                    var created = false;

                    if(options.type == 'image')
                    {
                        created = create.addImage(options);
                    }
                    else if(options.type == 'audio')
                    {
                        created = create.addAudio(options);
                    }
                    else if(options.type == 'video')
                    {
                        created = create.addVideo(options);
                    }
                    else if(options.type == 'text')
                    {
                        created = create.addText(options);
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
        localStorage.setItem('project', JSON.stringify(project.data));
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

        localStorage.setItem('project', JSON.stringify(project.data));
    },

    // Calculate total localstorage usage
    usage: function()
    {

    },
};

module.exports = storage;
