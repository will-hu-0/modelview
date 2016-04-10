(function() {

    var viewModelControllers = angular.module('viewModelControllers',[]);

    // controller for entity view page
    viewModelControllers.controller('entityController', function($scope, $filter, $sce, ngTableParams, cfpLoadingBar, ViewModelEntityService) {
        $scope.loadEntity = function(entityId) {
            cfpLoadingBar.start();
            $scope.entity = ViewModelEntityService.get({entityId:entityId}, function(entity) {
                $scope.entityName = entity.entityName;
                $scope.entityTable = entity.entityTable;
                $scope.entityFields = entity.entityFields;
                $scope.entitiesRangeArray = entity.entitiesRange.toString().split(',');

                $scope.entitiesTable = new ngTableParams(
                    {page: 1, count: 500},
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
                $scope.bizView = $sce.trustAsHtml(entity.bizView);
                $scope.entityPath = $sce.trustAsHtml(entity.entityPath);
                $scope.entityMock = $sce.trustAsHtml(entity.entityMock);

                $scope.$watch('$viewContentLoaded', function () {
                    // Pretty the code inside the page
                    $('pre code').each(function (i, block) {
                        hljs.highlightBlock(block);
                    });
                });
            });
        };
        $scope.search = function() {
            search();
        };
    });

    // controller for entities page
    viewModelControllers.controller('entitiesController', function($scope, cfpLoadingBar, ViewModelEntityService) {
        cfpLoadingBar.start()
        $scope.loadEntities = function() {
            $scope.entities = ViewModelEntityService.query();
            var ArrViews = $.map($scope.entities, function(data){ return data.views; });
            $scope.maxViews = Math.max.apply(Math, ArrViews);
        };
        $scope.search = function() {
            search();
        };
        $scope.go = function (path) {
            $(location).attr('href', path);
        }
    });

    // controller for view slide page
    viewModelControllers.controller('viewSlideController', function($scope, $sce, cfpLoadingBar, ViewModelSlideService) {
        cfpLoadingBar.start();
        var stepCount = 0;
        $scope.loadSlide = function(topic) {
            var ltopic = topic.toLowerCase();
            //var slideUrl = "/javascripts/sample1/"+ltopic+".json";
            var slideUrl = mode == "demo" ? "/javascripts/sample1/"+ltopic+".json"
                : REST_SERVICE_URI + "/slide/" + topic;
            $scope.slide = ViewModelSlideService.get({slideId:topic}, function(slide) {
                $scope.topic = slide.topic;
                $scope.slideSteps = slide.slideSteps;
                $scope.userCase = $sce.trustAsHtml(slide.userCase);
                stepCount = $scope.slideSteps.length;
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
    viewModelControllers.controller('slidesController', function($scope, cfpLoadingBar, ViewModelSlideService) {
        cfpLoadingBar.start()
        $scope.loadSlides = function() {
            $scope.slides = ViewModelSlideService.query();
        };
        $scope.search = function() {
            search();
        };
    });

    // controller for edit slide page
    viewModelControllers.controller('editSlideController', function($scope, $http, cfpLoadingBar) {
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
    viewModelControllers.controller('homeController', function($scope, $http, cfpLoadingBar) {
        cfpLoadingBar.start();
        $scope.loadHome = function() {
            var contributionUrl = "/javascripts/sample1/datas-years.json";
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
        var searchStr = $('#txtQueryEntity').val();
        if (searchStr == '') {
            searchStr.val('Put something here?')
            searchStr.click(function(){
                $(this).val('');
            })
        } else {
            $(location).attr('href', '/Entities/' + searchStr);
        }
    }

    $('#navSetDark').click (function() {
        $.cookie('modelviewTheme','darkly', { path: '/', expires: 7 });
        window.location.reload();
    });
    $('#navSetLight').click (function() {
        $.cookie('modelviewTheme','united', { path: '/', expires: 7 });
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
