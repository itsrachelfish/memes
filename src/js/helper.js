// Miscellaneous helper functions

module.exports =
{
    random: function(min, max)
    {
        return Math.round(Math.random() * (max - min)) + min;
    }
}
