var $ = require('wetfish-basic');
require('./load');

// Basic templating engine
var templates =
{
    // Search the passed element for templates and replace them
    find: function(element, callback)
    {
        var total = 0;
        var loaded = 0;

        var done = function()
        {
            if(total == loaded)
            {
                return true;
            }

            return false;
        }
        
        $(element).find('.template').each(function()
        {
            total++;
            
            var template = this;
            var src = $(this).data('src');

            if(src)
            {
                $(this).load('templates/' + src, function()
                {
                    // If more templates were loaded inside the current template
                    if($(template).find('.template').el.length > 0)
                    {
                        // Load them recursively
                        templates.find(template, function()
                        {
                            loaded++;

                            // Once all of the templates inside this template have been loaded, check if we're done
                            if(done())
                            {
                                callback();
                            }
                        });
                    }
                    else
                    {
                        // This template is finished loading, check if we're done
                        loaded++

                        if(done())
                        {
                            callback();
                        }
                    }
                });
            }
        });
    },

    // Clean up template wrappers after everything has loaded
    cleanup: function(callback)
    {
        $('.template').each(function()
        {
            // Create a new document fragment
            var fragment = document.createDocumentFragment();

            // Loop through all child nodes
            while(this.firstChild)
            {
                // Move them to the new fragment
                fragment.appendChild(this.firstChild);
            }

            // Replace the template wrapper with the child fragment
            this.parentNode.replaceChild(fragment, this);
        });

        // Now call the original callback
        callback();
    },

    ready: function(callback)
    {
        // Scan the body for template tags
        templates.find('body', function()
        {
            // Once the templates have loaded, clean up the remaining markup
            templates.cleanup(callback);
        });
    }
};

module.exports = templates;
