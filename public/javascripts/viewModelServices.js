/**
 * Created by Will on 2016-4-10.
 * The service for the app
 */

'use strict';

var vServices = angular.module('vServices', []);

var configs = JSON.parse($('#configs').val());
var REST_SERVICE_URI = configs.serviceuri;
var mode = configs.mode;

vServices.factory('AuthenticationService', function() {
    var auth = {
        isAuthenticated: false,
        isAdmin: false
    }
    return auth;
});


vServices.factory('UserService',  ['$http', '$q', function($http, $q){
    return {
        login: function(user) {
            return $http.post(REST_SERVICE_URI + "/login", user);
        },

        logout: function() {
            var url = REST_SERVICE_URI + "/logout";
            return process(url, 'GET', null, null, $http, $q);
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