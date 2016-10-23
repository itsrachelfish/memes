var $ = require('wetfish-basic');

var ranges =
{
    init: function()
    {
        $('.range input').on('input change', ranges.change);

        // Populate all range fields on page load
        $('.range input').each(function()
        {
            ranges.change.call(this);
        });
    },

    change: function()
    {
        $(this).parents('.range').find('.range-value').text($(this).value());
    }
};

module.exports = ranges;
