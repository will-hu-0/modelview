(function() {
    var REST_SERVICE_URI = "http://192.168.18.145:8085";

    // Define entityApp and controller
    var entityApp = angular.module('entityApp', ['ngTable', 'ngSanitize','angular-loading-bar','rzModule'])
        .config(function(cfpLoadingBarProvider) {
            cfpLoadingBarProvider.includeSpinner = true;
            cfpLoadingBarProvider.includeBar = true;
        })
        .config(['$httpProvider', function ($httpProvider) {
            $httpProvider.defaults.useXDomain = true;
            delete $httpProvider.defaults.headers.common['X-Requested-With'];
        }]);

    // controller for entity view page
    entityApp.controller('entityController', function($scope, $http, $filter, $sce, ngTableParams, cfpLoadingBar) {
        $scope.loadEntity = function(entityName) {
            cfpLoadingBar.start();
            var entityNameLowcase = entityName.toLowerCase();
            //var entityBaseUrl = "/javascripts/sample/"+entityNameLowcase+".entityBase.json";
            var entityBaseUrl = REST_SERVICE_URI + "/entity/" + entityName
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
        $scope.search = function() {
            search();
        };
    });

    // controller for entities page
    entityApp.controller('entitiesController', function($scope, $http, cfpLoadingBar) {
        cfpLoadingBar.start()
        $scope.loadEntities = function() {
            //var entitiesUrl = "/javascripts/sample/entities.json";
            var entitiesUrl = REST_SERVICE_URI + "/entity/";
            $http.get(entitiesUrl).success( function(response) {
                $scope.entities = response;
                var ArrViews = $.map(response, function(data){ return data.views; });
                $scope.maxViews = Math.max.apply(Math, ArrViews);
            });
        };
        $scope.search = function() {
            search();
        };
        $scope.go = function (path) {
            $(location).attr('href', path);
        }
    });

    // controller for view slide page
    entityApp.controller('viewSlideController', function($scope, $http, $sce, cfpLoadingBar) {
        cfpLoadingBar.start();
        var stepCount = 0;
        $scope.loadSlide = function(topic) {
            var ltopic = topic.toLowerCase();
            var slideUrl = "/javascripts/sample/"+ltopic+".json";
            $http.get(slideUrl).success( function(response) {
                $scope.topic = response.topic;
                $scope.steps = response.steps;
                $scope.userCase = $sce.trustAsHtml(response.userCase);
                stepCount = $scope.steps.length;
                $scope.initSlider(stepCount, '');
            })
        };
        $scope.initSlider = function(sCount, setValue) {
            $scope.slider = {
                minValue: 0,
                maxValue: sCount-1,
                value: setValue,
                options: {
                    showSelectionBar: true,
                    floor: 0,
                    ceil: sCount-1,
                    showTicksValues: getIEVersion()===9? false:true,
                    translate: function(value) {
                        return 'step' + (value + 1);
                    },
                    onChange: function(id, newValue) {
                        $('.carousel').carousel(newValue);
                    }
                }
            };
        };
        $scope.NextOrPerviousSlider = function(go, sCount) {
            var index = $('.carousel-indicators').children('.active').attr('data-slide-to');
            if (go === "+") {
                if (parseInt(index) + 1 == sCount) return;
                $scope.initSlider(sCount, parseInt(index) + 1);
            } else {
                if (parseInt(index) == 0) return;
                $scope.initSlider(sCount, parseInt(index)-1);
            }
        };
        $scope.search = function() {
            search();
        };
    });

    // controller for slides page
    entityApp.controller('slidesController', function($scope, $http, cfpLoadingBar) {
        cfpLoadingBar.start()
        $scope.loadSlides = function() {
            var entitiesUrl = "/javascripts/sample/slides.json";
            $http.get(entitiesUrl).success( function(response) {
                $scope.slides = response;
            });
        };
        $scope.search = function() {
            search();
        };
    });

    // controller for edit slide page
    entityApp.controller('editSlideController', function($scope, $http, cfpLoadingBar) {
        cfpLoadingBar.start();
        $scope.loadEditSlide = function() {
            var simplemde = new SimpleMDE({ element: $("#txtSlideEdit")[0] });
        };
        $scope.search = function() {
            search();
        };
        cfpLoadingBar.complete();
    });

    $('#txtQueryEntity').keydown(function(event) {
        if (event.keyCode == 13) {
            search();
        }
    });

    // controller for home
    entityApp.controller('homeController', function($scope, $http, cfpLoadingBar) {
        cfpLoadingBar.start();
        $scope.loadHome = function() {
            var contributionUrl = "/javascripts/sample/datas-years.json";
            $http.get(contributionUrl).success( function(response) {
                $scope.loadContributionCalendar(response);
            });
        };
        $scope.search = function() {
            search();
        };
        $scope.loadContributionCalendar = function(data) {
            var calendar = new CalHeatMap();
            calendar.init({
                data: data,
                start: new Date(2000, 0),
                domain: "month",
                subDomain: "x_day",
                range : 7,
                cellsize: 16,
                cellpadding: 3,
                cellradius: 5,
                domainGutter: 15,
                weekStartOnMonday: 0,
                scale: [40, 60, 80, 100]
            });
        };
    })

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
    });

    $('.carousel').carousel({
        interval: false
    });

    function getIEVersion() {
        var sAgent = window.navigator.userAgent;
        var Idx = sAgent.indexOf("MSIE");
        // If IE, return version number.
        if (Idx > 0)
            return parseInt(sAgent.substring(Idx+ 5, sAgent.indexOf(".", Idx)));
        // If IE 11 then look for Updated user agent string.
        else if (!!navigator.userAgent.match(/Trident\/7\./))
            return 11;
        else
            return 0; //It is not IE
    }


})();
