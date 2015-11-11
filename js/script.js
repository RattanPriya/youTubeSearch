(function() {
    var app = angular.module('MyApp', []);

    app.controller('MainController', function($http, $sce) {
        var ctrl = this;
        ctrl.results = [];

        ctrl.search = function(token) {
            var config = {
                part: 'snippet, id',
                q: ctrl.query,
                type: 'video',
                key: 'AIzaSyDBgMqMVuQqofhuFcemc2D9aCBI3RswZSk'
            }
            if (token) {
                config.pageToken = token;
            }

            ctrl.results = [];

            $http.get('https://www.googleapis.com/youtube/v3/search', {
                params: config
            }).then(function(response) {
                ctrl.nextPageToken = response.data.nextPageToken;
                ctrl.prevPageToken = response.data.prevPageToken;
                ctrl.results = response.data.items;
            });
        };

        ctrl.getVideoUrl = function(videoId) {
            return $sce.trustAsResourceUrl('https://www.youtube.com/embed/' + videoId);
        };
    });


    app.directive('searchListItem', function() {
        return {
            restrict: 'EA', //E = element, A = attribute, C = class, M = comment         
            scope: {
                //@ reads the attribute value, = provides two-way binding, & works with functions
                title: '@'
            },
            template: '<div>{{ myVal }}</div>',
            templateUrl: 'mytemplate.html',
            link: function($scope, element, attrs) {} //DOM manipulation
        }
    });
})();