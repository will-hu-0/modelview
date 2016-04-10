'use strict';
/**
 * Created by will on 16-4-10.
 * Service
 */

var vServices = angular.module('vServices', ['ngResource']);

var configs = JSON.parse($('#configs').val());
var REST_SERVICE_URI = configs.serviceuri;
var mode = configs.mode;

vServices.factory('ViewModelEntityService', ['$resource',
    function($resource){
        var uri = mode == "demo" ? "/javascripts/sample1/:entityId.json" : REST_SERVICE_URI + "/entity/:entityId";
        return $resource(uri, {}, {
            query: {method:'GET', isArray:true}
        });
    }]);

vServices.factory('ViewModelSlideService', ['$resource',
    function($resource){
        var uri = mode == "demo" ? "/javascripts/sample2/:slideId.json" : REST_SERVICE_URI + "/slide/:slideId";
        return $resource(uri, {}, {
            query: {method:'GET', isArray:true}
        });
    }]);
