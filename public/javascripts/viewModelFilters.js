/**
 * Created by Will on 2016-5-10.
 * The filter for the app
 */
'use strict';

var app = angular.module('viewModelFilters',[]);

/**
 * "Truncate" filter is to truncate the input string.
 * If the length is more than predefined length, the input string
 * would be dropped, ended up with "..."
 */
app.filter('truncate', function() {
    return function(input, truncateLength) {
        input = input || '';
        var output = '';
        if (input.length <= truncateLength) {
            output = input;
        } else {
            output = input.substring(0, truncateLength) + "...";
        }
        return output;
    }
})
