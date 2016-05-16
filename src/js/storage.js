//
// This file handles saving data from localstorage and loading content on refresh
//
//////////////////////////////////////////////////

// Load wetfish basic
var $ = require('wetfish-basic');

// Load other stuff
var helper = require('./helper');

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

        // Use default project data if none is found
        project.data = project.defaults;
    },

    // Load saved data onto the page
    load: function()
    {
        
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
