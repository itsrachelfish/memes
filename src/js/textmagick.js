// Load wetfish basic
var $ = require('wetfish-basic');

// Load other stuff
var extend = require('extend');

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

TextMagick.prototype.init = function()
{
    this.element.wrapper = $('.preload .textmagick').clone();

    this.element.svg = $(this.element.wrapper).find('svg').el[0];
    this.element.text = $(this.element.wrapper).find('text.text').el[0];
    this.element.stroke = $(this.element.wrapper).find('text.stroke').el[0];

    this.setText();
    this.refresh();

    return this.element.svg;
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

    this.element.text.setAttribute('fill', this.options.color);

    this.element.stroke.setAttribute('stroke', this.options.border.color);
    this.element.stroke.setAttribute('stroke-width', this.options.border.size);
}

TextMagick.prototype.resize = function()
{
    var size = this.element.stroke.getBBox();

    // Add the stroke size if stroke is enabled
    if(this.options.border.enabled)
    {
        size.height += this.options.border.size;
        size.width += this.options.border.size;
    }

    this.element.svg.setAttribute('width', size.width);
    this.element.svg.setAttribute('height', size.height);
}

TextMagick.prototype.getElement = function()
{
    return this.element.wrapper;
}

module.exports = TextMagick;

