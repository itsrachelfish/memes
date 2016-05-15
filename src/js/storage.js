//
// This file handles saving data from localstorage and loading content on refresh
//
//////////////////////////////////////////////////

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
    },

    // Load saved data onto the page
    load: function()
    {

    },

    // Save or update an object
    save: function()
    {

    },

    // Calculate total localstorage usage
    usage: function()
    {

    },
};

module.exports = save;
