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

      $http.get('https://www.googleapis.com/youtube/v3/search', {params: config}).then(function(response) {
        ctrl.nextPageToken = response.data.nextPageToken;
        ctrl.prevPageToken = response.data.prevPageToken;
        ctrl.results = response.data.items;
      });
    };

    ctrl.getVideoUrl = function(videoId) {
      return $sce.trustAsResourceUrl('https://www.youtube.com/embed/' + videoId);
    };
  });
})();
