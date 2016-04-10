/**
 * Created by will on 16-4-10.
 */
'use strict';

/* App Module */

var viewModelApp = angular.module('viewModelApp', [
    'ngTable',
    'ngSanitize',
    'angular-loading-bar',
    'rzModule',
    'viewModelControllers',
    'vServices'
]);

viewModelApp.config(function(cfpLoadingBarProvider) {
        cfpLoadingBarProvider.includeSpinner = true;
        cfpLoadingBarProvider.includeBar = true;
    })
    .config(['$httpProvider', function ($httpProvider) {
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }]);