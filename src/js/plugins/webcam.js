var $ = require('wetfish-basic');

// Webcam constructor
var Webcam = function(selector)
{
    this.element = $(selector);

    // Initialize webcam
    this.init();
}

// See if getUserMedia is natively available, otherwise fall back to vendor prefixes
Webcam.prototype.api = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;

Webcam.prototype.init = function()
{
    if(this.api)
    {
        // We have to pass the scope around like this because getUserMedia has to be called as a child of navigator
        var scope = this;

        this.api.call(navigator, {video: {width: 1920, height: 1080}}, function(stream) { scope.success(stream) }, function() { scope.error() });
    }
    else
    {
        alert('getUserMedia is not supported in your browser. :(');
    }
}

Webcam.prototype.success = function(stream)
{
    this.stream = stream;
    this.element.attr('src', window.URL.createObjectURL(stream));
}

Webcam.prototype.stop = function()
{
    this.stream.getVideoTracks().forEach(function(track)
    {
        track.stop();
    });
}

Webcam.prototype.error = function()
{
    alert('There was an error starting video playback! Make sure you allow permissions on this page');
}

module.exports = Webcam;
