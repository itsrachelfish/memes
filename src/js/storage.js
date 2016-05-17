//
// This file handles saving data from localstorage and loading content on refresh
//
//////////////////////////////////////////////////

// Load wetfish basic
var $ = require('wetfish-basic');

// Load other stuff
var helper = require('./helper');
var element = require('./element');
var presets = require('./presets');

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
            for(var id in project.data.frames[project.data.frame])
            {
                if(project.data.objects[id] !== undefined)
                {
                    var object = project.data.objects[id];

                    if(object.type == 'image')
                    {
                        element.addImage(object);
                    }
                    else if(object.type == 'audio')
                    {
                        element.addAudio(object);
                    }
                    else if(object.type == 'video')
                    {
                        element.addVideo(object);
                    }
                    else if(object.type == 'text')
                    {
                        element.addText(object);
                    }
                    else if(object.type == 'preset' && presets[object.preset] !== undefined)
                    {
                        presets[object.preset].init();
                        presets[object.preset].create();
                    }
                    else
                    {
                        console.log("Object '" + id + "' failed to load, no handler function matched.");
                    }
                }
            }
        }
    },

    // Save or update an object
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

        project.data.frames[project.data.frame][id] = true;

        localStorage.setItem('project', JSON.stringify(project.data));
    },

    // Calculate total localstorage usage
    usage: function()
    {

    },
};

module.exports = storage;
