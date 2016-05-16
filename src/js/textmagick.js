// Load wetfish basic
var $ = require('wetfish-basic');

// Load other stuff
var extend = require('extend');
var helper = require('./helper');

var TextMagick = function(text, options)
{
    var defaults =
    {
        size: 50,
        color: '#fff',
        border:
        {
            enabled: true,
            size: 8,
            color: '#000'
        }
    };

    this.text = text || this.text;
    this.options = extend(true, defaults, options);
    this.init();

    return this;
}

TextMagick.prototype.text = 'sample text';
TextMagick.prototype.element = {};
TextMagick.prototype.pattern = {};
TextMagick.prototype.id = {};

TextMagick.prototype.init = function()
{
    this.element.wrapper = $('.preload .textmagick').clone();
    this.element.svg = $(this.element.wrapper).find('svg').el[0];
    this.element.text = $(this.element.wrapper).find('text.text').el[0];
    this.element.stroke = $(this.element.wrapper).find('text.stroke').el[0];
    this.pattern.text = $(this.element.wrapper).find('pattern.text').el[0];
    this.pattern.stroke = $(this.element.wrapper).find('pattern.stroke').el[0];

    // Generate randomized, unique IDs for the pattern elements
    this.id.text = helper.randomString();
    this.id.stroke = helper.randomString();

    $(this.pattern.text).attr('id', this.id.text);
    $(this.pattern.stroke).attr('id', this.id.stroke);

    this.setText();
    this.refresh();

    return this.element.svg;
}

TextMagick.prototype.setPatternSize = function(url, type)
{
    var scope = this;
    var image = document.createElement('img');
    $(image).attr('src', url);

    $(image).on('load', function()
    {
        if(type == 'text')
        {
            $(scope.pattern.text).attr('width', image.width);
            $(scope.pattern.text).attr('height', image.height);

            $(scope.element.wrapper).find('pattern.text image').attr('width', image.width);
            $(scope.element.wrapper).find('pattern.text image').attr('height', image.height);
        }
        else
        {
            $(scope.pattern.stroke).attr('width', image.width);
            $(scope.pattern.stroke).attr('height', image.height);

            $(scope.element.wrapper).find('pattern.stroke image').attr('width', image.width);
            $(scope.element.wrapper).find('pattern.stroke image').attr('height', image.height);
        }
    });
}

TextMagick.prototype.setText = function(text)
{
    text = text || this.text;

    this.element.text.innerHTML = text.replace(/</g, '&lt;');
    this.element.stroke.innerHTML = text.replace(/</g, '&lt;');
}

TextMagick.prototype.setOptions = function(options)
{
    // Combine currently used options with new options
    this.options = extend(true, this.options, options);
    this.refresh();
}

TextMagick.prototype.refresh = function()
{
    this.element.text.setAttribute('font-size', this.options.size);
    this.element.stroke.setAttribute('font-size', this.options.size);

    if(this.options.image)
    {
        this.setPatternSize(this.options.image, 'text');

        $(this.element.wrapper).find('pattern.text image').el[0].setAttribute('xlink:href', this.options.image);
        this.element.text.setAttribute('fill', 'url(#' + this.id.text + ')');
    }
    else
    {
        this.element.text.setAttribute('fill', this.options.color);
    }

    if(this.options.border.enabled)
    {
        if(this.options.border.image)
        {
            this.setPatternSize(this.options.image, 'stroke');

            $(this.element.wrapper).find('pattern.stroke image').el[0].setAttribute('xlink:href', this.options.border.image);
            this.element.stroke.setAttribute('stroke', 'url(#' + this.id.stroke + ')');
        }
        else
        {
            this.element.stroke.setAttribute('stroke', this.options.border.color);
        }

        this.element.stroke.setAttribute('stroke-width', this.options.border.size);
    }
    else
    {
        this.element.stroke.setAttribute('stroke', 'none');
        this.element.stroke.setAttribute('stroke-width', 0);
    }
}

TextMagick.prototype.resize = function()
{
    // Get bounding box of the svg content
    var size = this.element.stroke.getBBox();

    // Add the border size if the border is enabled
    if(this.options.border.enabled)
    {
        this.options.border.size = parseInt(this.options.border.size);

        size.height += this.options.border.size;
        size.width += this.options.border.size;

        this.element.stroke.setAttribute('x', this.options.border.size / 2);
        this.element.stroke.setAttribute('y', this.options.border.size / 2);

        this.element.text.setAttribute('x', this.options.border.size / 2);
        this.element.text.setAttribute('y', this.options.border.size / 2);
    }

    // Set the svg to be the same size as the rendered content (otherwise the text could be cut off)
    this.element.svg.setAttribute('width', size.width);
    this.element.svg.setAttribute('height', size.height);
}

TextMagick.prototype.getElement = function()
{
    return this.element.wrapper;
}

module.exports = TextMagick;

