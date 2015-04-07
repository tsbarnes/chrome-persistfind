var persistfind = angular.module('persistfind', ['ngMaterial', 'ngMessages']);

persistfind.controller('FindCtrl', function($scope) {
  $scope.port = chrome.runtime.connect({
    name: 'popup'
  });
  $scope.data = {
    'find_string': ''
  };

  $scope.port.onMessage.addListener(function(message) {
    for(var key in message) {
      $scope.data[key] = message[key];
    }
    $scope.$apply();
  });
  
  $scope.onChange = function() {
    chrome.storage.local.set($scope.data);
  };
});
