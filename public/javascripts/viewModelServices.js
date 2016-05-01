'use strict';

var vServices = angular.module('vServices', []);

var configs = JSON.parse($('#configs').val());
var REST_SERVICE_URI = configs.serviceuri;
var mode = configs.mode;

vServices.factory('ViewModelEntityService', ['$http', '$q', function($http, $q){
    return {
        queryEntities: function() {
            var deferred = $q.defer();
            $http({method: 'GET', url: mode == "demo" ? "/javascripts/sample/entities.json" : REST_SERVICE_URI + "/entities"}).
                success(function(data, status, headers, config) { deferred.resolve(data); }).
                error(function(data, status, headers, config) { deferred.reject(data); });
            return deferred.promise;
        },

        queryEntity: function(entityName) {
            var deferred = $q.defer();
            $http({method: 'GET', url: mode == "demo" ? "/javascripts/sample/"+entityName+".json" : REST_SERVICE_URI + "/entity/"+entityName }).
            success(function(data, status, headers, config) { deferred.resolve(data); }).
            error(function(data, status, headers, config) { deferred.reject(data); });
            return deferred.promise;
        }
    };
}]);

vServices.factory('ViewModelTopicService', ['$http', '$q', function($http, $q) {
    return {
        queryTopics: function() {
            var deferred = $q.defer();
            $http({method: 'GET', url: mode == "demo" ? "/javascripts/sample/topics.json" : REST_SERVICE_URI + "/topics"}).
            success(function(data, status, headers, config) { deferred.resolve(data); }).
            error(function(data, status, headers, config) { deferred.reject(data); });
            return deferred.promise;
        },

        queryTopic: function(name) {
            var deferred = $q.defer();
            $http({method: 'GET', url: mode == "demo" ? "/javascripts/sample/"+name+".json" : REST_SERVICE_URI + "/topic/"+name }).
            success(function(data, status, headers, config) { deferred.resolve(data); }).
            error(function(data, status, headers, config) { deferred.reject(data); });
            return deferred.promise;
        }
    };
}]);