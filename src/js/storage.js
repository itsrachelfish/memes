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
    init: function()
    {

    },

    load: function()
    {

    },

    save: function()
    {

    },

    usage: function()
    {

    },
};

module.exports = save;
