// Define entityApp and controller
var entityApp = angular.module('entityApp', ['ngTable', 'ngSanitize']);

(function() {
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
        }

        $scope.searchEntity = function() {
            if ($('#txtQueryEntity').val() == '') {
                $('#txtQueryEntity').val('Put something here?')
            } else {
                $(location).attr('href', '/Entities/' + $('#txtQueryEntity').val());
            }
        };

        $('#txtQueryEntity').keydown(function(event) {
            if (Event.keyCode == 13) {
                alert('123');
            }
        });
    });

})();
