// Check how the plugin should be exported
(function(factory)
{
    if(typeof module === 'object' && module.exports)
    {
        // We're in Node or a CommonJS compatable environment
        factory(require('wetfish-basic'));
    }
    else if(typeof define === 'function' && define.amd)
    {
        // We're in a browser being loaded with AMD (Require.js)
        define(['wetfish-basic'], factory);
    }
    else
    {
        // We're in a browser, so assume everything has been loaded as global variables
        factory(basic);
    }
}
(function($)
{
    var Loader = function() {}
    Loader.prototype.total = 0;
    Loader.prototype.loaded = 0;

    Loader.prototype.load = function(element, url, callback)
    {
        fetch(url).then(function(response)
        {
            response.text().then(function(text)
            {
                $(element).html(text);
                callback();
            });
        });
    }

    Loader.prototype.done = function()
    {
        if(this.total == this.loaded)
        {
            return true;
        }

        return false;
    }

    // Wetfish basic wrapper
    $.prototype.load = function(url, callback)
    {
        var loader = new Loader();
        
        this.forEach(this.elements, function(element)
        {
            loader.total++;
            loader.load(element, url, function()
            {
                loader.loaded++;
                if(loader.done())
                {
                    callback();
                }
            });
        });
    }
}));
