// Define entityApp and controller
var entityApp = angular.module('entityApp', ['ngTable', 'ngSanitize']);

(function() {
    // controller for entity view page
    entityApp.controller('entityController', function($scope, $http, $filter, $sce, ngTableParams) {
        $scope.loadEntity = function(entityName) {
            var entityNameLowcase = entityName.toLowerCase();
            var entityBaseUrl = "/javascripts/sample/"+entityNameLowcase+".entityBase.json";
            $http.get(entityBaseUrl).success( function(response) {
                $scope.entityName = response.entityName;
                $scope.entityTable = response.entityTable;
                $scope.entityFields = response.entityFields;
                $scope.entitiesRangeArray = response.entitiesRange.toString().split(',');

                $scope.entitiesTable = new ngTableParams(
                    { page: 1, count: 500 },
                    {
                        total: $scope.entityFields.length,
                        counts: [], // No items per page
                        getData: function ($defer, params) {
                            $scope.entityData = params.sorting() ?
                                $filter('orderBy')($scope.entityFields, params.orderBy()) : $scope.entityFields;
                            $scope.entityData = $scope.entityData.slice(
                                (params.page() - 1) * params.count(), params.page() * params.count());
                            $defer.resolve($scope.entityData);
                        }
                    });
                $scope.bizView = $sce.trustAsHtml(response.bizView);
                $scope.entityPath = $sce.trustAsHtml(response.entityPath);
                $scope.entityMock = $sce.trustAsHtml(response.entityMock);

                $scope.$watch('$viewContentLoaded', function(){
                    // Pretty the code inside the page
                    $('pre code').each(function (i, block) {
                        hljs.highlightBlock(block);
                    });

                });

            })
        };

        $scope.searchEntity = function() {
            search();
        };
    });

    // controller for entities page
    entityApp.controller('entitiesController', function($scope, $http, $location) {
        $scope.loadEntities = function() {
            var entitiesUrl = "/javascripts/sample/entities.json";
            $http.get(entitiesUrl).success( function(response) {
                $scope.entities = response.entities;
                var ArrViews = $.map(response.entities, function(data){ return data.views; });
                $scope.maxViews = Math.max.apply(Math, ArrViews);
            });
        };

        $scope.go = function (path) {
            $(location).attr('href', path);
        };
        $scope.searchEntity = function() {
            search();
        };
    });

    $('#txtQueryEntity').keydown(function(event) {
        if (event.keyCode == 13) {
            search();
        }
    });

    /* Define the onclick event of search textbox in the nav bar */
    function search() {
        if ($('#txtQueryEntity').val() == '') {
            $('#txtQueryEntity').val('Put something here?')
            $('#txtQueryEntity').click(function(){
                $(this).val('');
            })
        } else {
            $(location).attr('href', '/Entities/' + $('#txtQueryEntity').val());
        }
    }

    $('#navSetDark').click (function() {
        $.cookie('modelviewTheme','darkly', { expires: 7, path: '/' });
        window.location.reload();
    });
    $('#navSetLight').click (function() {
        $.cookie('modelviewTheme','united', { expires: 7, path: '/' });
        window.location.reload();
    })

})();
