/**
 * Created by Will on 2016-4-10.
 * The service for the app
 */

'use strict';

var vServices = angular.module('vServices', []);

var configs = JSON.parse($('#configs').val());
var REST_SERVICE_URI = configs.serviceuri;
var mode = configs.mode;

vServices.factory('AuthenticationService', function($window) {
    var auth = {
        isAuthenticated: $window.sessionStorage.token != null,
        isAdmin: false
    };
    return auth;
});

vServices.factory('TokenInterceptor', function ($q, $window, AuthenticationService) {
    return {
        request: function (config) {
            config.headers = config.headers || {};
            if ($window.sessionStorage.token) {
                config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
            }
            return config;
        },

        requestError: function(rejection) {
            return $q.reject(rejection);
        },

        /* Set Authentication.isAuthenticated to true if 200 received */
        response: function (response) {
            if (response != null && (response.status == 200 || response.status == 201)
                && $window.sessionStorage.token && !AuthenticationService.isAuthenticated) {
                AuthenticationService.isAuthenticated = true;
            }
            return response || $q.when(response);
        },

        /* Revoke client authentication if 401 is received */
        responseError: function(rejection) {
            if (rejection.status === 401) {
                if (rejection != null && ($window.sessionStorage.token || AuthenticationService.isAuthenticated)) {
                    delete $window.sessionStorage.token;
                    AuthenticationService.isAuthenticated = false;
                    $(location).attr('href', '/login');
                }
                $(location).attr('href', '/login');
            }
            return $q.reject(rejection);
        }
    };
});


vServices.factory('UserService',  ['$http', '$q', function($http, $q){
    return {
        login: function(user) {
            return $http.post(REST_SERVICE_URI + "/login", user);
        },

        logout: function() {
            return $http.get(REST_SERVICE_URI + "/logout");
        }
    };
}]);

vServices.factory('ViewModelEntityService', ['$http', '$q', function($http, $q){
    return {
        queryEntities: function() {
            var url = mode == "demo" ? "/javascripts/sample/entities.json" : REST_SERVICE_URI + "/entities";
            return process(url, 'GET', null, null, $http, $q);
        },

        queryEntity: function(entityName) {
            var url = mode == "demo" ? "/javascripts/sample/"+entityName+".json" : REST_SERVICE_URI + "/entity/"+entityName;
            return process(url, 'GET', null, null, $http, $q);
        }
    };
}]);

vServices.factory('ViewModelTopicService', ['$http', '$q', function($http, $q) {
    return {
        queryTopics: function() {
            var url = mode == "demo" ? "/javascripts/sample/topics.json" : REST_SERVICE_URI + "/topics";
            return process(url, 'GET', null, null, $http, $q);
        },

        queryTopic: function(name) {
            var url = mode == "demo" ? "/javascripts/sample/"+name+".json" : REST_SERVICE_URI + "/topic/"+name;
            return process(url, 'GET', null, null, $http, $q);
        },

        postTopic: function(topic) {
            return process(REST_SERVICE_URI + "/topic",
                'POST',
                topic,
                {'Content-Type': 'application/json; charset=utf-8'},
                $http, $q);
        },

        postTopicSteps: function(topicSteps) {
            return process(REST_SERVICE_URI + "/topicstep",
                'POST',
                topicSteps,
                {'Content-Type': 'application/json; charset=utf-8'},
                $http, $q);
        },

        putTopic: function(topic) {
            return process(REST_SERVICE_URI + "/topic",
                'PUT',
                topic,
                {'Content-Type': 'application/json; charset=utf-8'},
                $http, $q);
        },

        putTopicSteps: function(topicSteps) {
            return process(REST_SERVICE_URI + "/topicstep",
                'PUT',
                topicSteps,
                {'Content-Type': 'application/json; charset=utf-8'},
                $http, $q);
        }
    };
}]);

// Common http processor
function process(url, method, data, headers, $http, $q) {
    var deferred = $q.defer();
    $http({method: method, url: url, data: data, headers: headers }).
    success(function(data, status, headers, config) { deferred.resolve(data); }).
    error(function(data, status, headers, config) { deferred.reject(data); });
    return deferred.promise;
}