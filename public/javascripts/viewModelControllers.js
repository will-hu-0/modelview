'use strict';

// Define reverse for jquery
jQuery.fn.reverse = [].reverse;

// Define array remove function
Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

(function() {

    var viewModelControllers = angular.module('viewModelControllers',[]);
    var converter = new showdown.Converter();

    // controller for entity view page
    viewModelControllers.controller('entityController', function($scope, $filter, $sce, ngTableParams, cfpLoadingBar, ViewModelEntityService) {
        $scope.loadEntity = function(entityId) {
            cfpLoadingBar.start();
            var promise = ViewModelEntityService.queryEntity(entityId);
            promise.then(function(data) {
                //TODO: if data is null, take some action
                $scope.entity = data;
                $scope.entityName = data.entityName;
                $scope.entityTable = data.entityTable;
                $scope.entityColumns = data.entityColumns;
                $scope.existEntitiesArray = data.existEntities.toString().split(',');

                $scope.entitiesTable = new ngTableParams(
                    {page: 1, count: 500},
                    {
                        total: $scope.entityColumns.length,
                        counts: [], // No items per page
                        getData: function ($defer, params) {
                            $scope.entityData = params.sorting() ?
                                $filter('orderBy')($scope.entityColumns, params.orderBy()) : $scope.entityColumns;
                            $scope.entityData = $scope.entityData.slice(
                                (params.page() - 1) * params.count(), params.page() * params.count());
                            $defer.resolve($scope.entityData);
                        }
                    });
                $scope.businessValue = $sce.trustAsHtml(converter.makeHtml(data.businessValue));
                $scope.entityPath = $sce.trustAsHtml(data.entityPath);
                $scope.entityBuilder = $sce.trustAsHtml(data.entityBuilder);

                $scope.$watch('$viewContentLoaded', function () {
                     //Pretty the code inside the page
                    $('pre code').each(function (i, block) {
                        hljs.highlightBlock(block);
                    });
                });
            }, function (data) {
                // Log (error) to user
            })
        };
        $scope.search = function() {
            search();
        };
    });

    // controller for entities page
    viewModelControllers.controller('entitiesController', function($scope, cfpLoadingBar, ViewModelEntityService) {
        cfpLoadingBar.start()
        $scope.loadEntities = function() {
            var promise = ViewModelEntityService.queryEntities();
            promise.then(function(data) {
                $scope.entities = data;
                var ArrViews = $.map($scope.entities, function (data) {
                    return data.views;
                });
                $scope.maxViews = Math.max.apply(Math, ArrViews);
            }, function (data) {
                // Log (error) to user
            });
        };
        $scope.search = function() {
            search();
        };
        $scope.go = function (path) {
            $(location).attr('href', path);
        }
    });

    // controller for view topic page
    viewModelControllers.controller('viewTopicController', function($scope, $sce, cfpLoadingBar, ViewModelTopicService) {
        cfpLoadingBar.start();
        var stepCount = 0;

        $scope.loadTopic = function(name) {
            var promise = ViewModelTopicService.queryTopic(name);
            promise.then(function(data) {
                $scope.topic = data;
                $scope.title = data.title;
                $scope.topicSteps = data.topicSteps;
                $scope.userCase = $sce.trustAsHtml(converter.makeHtml(data.userCase));
                stepCount = $scope.topicSteps.length;
                $scope.initSlider(stepCount, '');
            }, function(data) {
                // Log (error) to user
            });
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

    // controller for topics page
    viewModelControllers.controller('topicsController', function($scope, cfpLoadingBar, ViewModelTopicService) {
        cfpLoadingBar.start()
        $scope.loadTopics = function() {
            var promise = ViewModelTopicService.queryTopics();
            promise.then(function(data) {
                $scope.topics = data;
            }, function(data) {
                // Log (error) to user
            });
        };
        $scope.search = function() {
            search();
        };
    });


    // controller for edit topic page
    viewModelControllers.controller('editTopicController', function($scope, $http, cfpLoadingBar, ViewModelTopicService) {
        cfpLoadingBar.start();
        var tempFilesArray = new Array();   //Temp array for upload files
        $scope.formData = {};
        var simplemde;

        // Edit topic or Create new topic
        $scope.loadEditTopic = function(name) {
            simplemde = new SimpleMDE({ element: $("#userCase")[0] });
            if (name != '') {
                // Edit model
                var promise = ViewModelTopicService.queryTopic(name);
                promise.then(function(data) {
                    $scope.legend = data.title;
                    loadImageUploader(data.topicSteps, tempFilesArray);
                }, function(data) {
                    // Log (error) to user
                });
            } else {
                loadImageUploader(null, tempFilesArray);
                $scope.legend = "NEW TOPIC";
            }
        };

        // process the form
        $scope.processForm = function() {
            //TODO need to add validation
            $scope.formData.title = $scope.formData.title;  // build title
            $scope.formData.description = $scope.formData.description;  // build description
            $scope.formData.name = $scope.formData.title.replace(/[^\d\w]+/g,"_");   // build name
            $scope.formData.userCase = simplemde.value();    // build userCase

            postTopic($scope.formData);
        };

        function postTopic(topic) {
            var promise = ViewModelTopicService.postTopic(topic);
            promise.then(function(data) {
                postTopicStep(data, topic.name);
            }, function(data) {
                // Log (error) to user
            });
        }

        function postTopicStep(topic_id, topicName) {
            var stepsArray = new Array();
            //alert(tempFilesArray);
            $(".ajax-file-upload-container").find(".ajax-file-upload-serverfilename").reverse().each(function (i, item) {
                var step = new Object();
                step.stepId = i;
                step.screenShotUrl = "/uploads/" + item.innerText;
                step.topic_Id = topic_id;
                stepsArray.push(step);
                console.log(item.innerHTML);
            });

            $(".ajax-file-upload-container").find(".form-control").reverse().each(function (i, item) {
                stepsArray[i].description = item.value;
                console.log(stepsArray[i]);
            });

            var promise = ViewModelTopicService.postTopicSteps(stepsArray);
            promise.then(function(data) {
                //alert('Successfully!');
                $(location).attr('href', '/topics/' + topicName);
            }, function(data) {
                // Log (error) to user
            });

        }


        $scope.search = function() {
            search();
        };
        $scope.upload = function() {
            //alert(simplemde.value());
        };
        cfpLoadingBar.complete();
    });

    function loadImageUploader(existingFiles, tempFilesArray) {
        var extraObj = $("#extraupload").uploadFile({
            url: "/fileupload/",
            fileName: "myfile",
            allowedTypes: "jpg,png,gif,jpeg",
            allowDuplicates: false,
            acceptFiles: "image/*",
            showPreview: true,
            showDelete: true,
            previewHeight: "100px",
            previewWidth: "140px",
            sequential: true,
            showFileSize: false,
            uploadStr: "CHOOSE FILES",
            onLoad:function(obj) {
                if (typeof existingFiles != 'undefined' && existingFiles != null) {
                    // load preview images
                    for (var i = 0; i < existingFiles.length; i++) {
                        var imagePath = existingFiles[i]["screenShotUrl"];  // => /uploads/1234
                        var imageName = imagePath.substring(imagePath.lastIndexOf('/') + 1);  // => 1234
                        obj.createProgress(imageName, imagePath, 200);
                        tempFilesArray.push(imageName); //load existing files into the file array
                    }
                    // load step description
                    $(".ajax-file-upload-container").find(".form-control").reverse().each(function (i, items) {
                        items.value = existingFiles[i]["shortDescription"];
                    });
                }
            },
            onSuccess: function (files, response, xhr, pd) {
                tempFilesArray.push(response[0].filename.replace(/\.[^/.]+$/, ""));
            },
            deleteCallback: function (data, pd) {
                for (var i = 0; i < data.length; i++) {
                    if (data[i] instanceof Object) {
                        tempFilesArray.remove(data[i].filename.replace(/\.[^/.]+$/, "")); // Remove newly uploaded file
                    } else {
                        tempFilesArray.remove(data[i]); // Remove existing file
                    }
                }
            },
            extraHTML: function () {
                var html = "<div class='extraUploadTempContainer'>" +
                    //"<div class='extraUploadTempTitle'><b>SCREENSHOT DESCRIPTION:</b></div>" +
                    "<div class='extraUploadTempContent'>" +
                    "<input type='text' class='form-control' name='stepDesc' placeholder='Input the step description here..'/>" +
                    "</div>" +
                    "</div>";
                return html;
            },
            autoSubmit: false
        });
        $("#extrabutton").click(function () {
            extraObj.startUpload();
        });
    }

    $('#txtQueryEntity').keydown(function(event) {
        if (event.keyCode == 13) {
            search();
        }
    });

    // controller for home
    viewModelControllers.controller('homeController', function($scope, $http, cfpLoadingBar) {
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
    $('.navSetLight').click (function() {
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
