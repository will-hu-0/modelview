/**
 * Created by will on 2016-4-10.
 */
'use strict';

/* App Module */

var viewModelApp = angular.module('viewModelApp', [
    'ngTable',
    'ngSanitize',
    'angular-loading-bar',
    'rzModule',
    'viewModelFilters',
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
        $httpProvider.interceptors.push('TokenInterceptor');
    }])

viewModelApp.run(function($rootScope, $location, $window, AuthenticationService) {
        //redirect only if both isAuthenticated is false and no token is set
        if (!AuthenticationService.isAuthenticated && !$window.sessionStorage.token
            && window.location.pathname != "/login") {
            $(location).attr('href', '/login');
        }
});