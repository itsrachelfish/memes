var $ = require('wetfish-basic');
require('load');

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
                    // If more templates were loaded inside the template
                    if($(template).find('.template').el.length > 0)
                    {
                        templates.find(template, function()
                        {
                            loaded++;

                            if(done())
                            {
                                callback();
                            }
                        });
                    }
                    else
                    {
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
            var fragment = document.createDocumentFragment();

            while(this.firstChild)
            {
                fragment.appendChild(this.firstChild);
            }
            
            this.parentNode.replaceChild(fragment, this);
        });

        callback();
    },

    ready: function(callback)
    {
        // Scan the body for template tags
        templates.find('body', function()
        {
            templates.cleanup(callback);
        });
    }
};

module.exports = templates;
