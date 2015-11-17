angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, Errors) {
  // [Errors] -> String
  function totalHours(errors) {
    return Number(errors.reduce(function (acc, err) {
      var cost = Number(err.cost);
      return acc + (err.unit === 'hrs' ? cost : cost/60);
    }, 0)).toFixed(2);
  }
  function is(type) { return function (error) { return error.type === type; }; }
  $scope.$on('$ionicView.enter', function(e) {
    $scope.errors = Errors.all();
    $scope.errorCount = $scope.errors.length;
    $scope.hours = {
      Type: totalHours($scope.errors.filter(is('Type'))),
      Other: totalHours($scope.errors.filter(is('Other')))
    };
  });
})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})

.controller('ErrorsCtrl', function($scope, Errors) {

  $scope.errors = [];

  function init() {
    $scope.errors = Errors.all().concat([]).reverse();
  }

  $scope.$on('$ionicView.enter', function(e) {
    init();
  });

  $scope.newError = {
    type: 'Type',
    cost: 1,
    unit: 'min'
  };

  $scope.add = function () {
    Errors.save({
      type: $scope.newError.type, 
      cost: $scope.newError.cost,
      unit: $scope.newError.unit
    });
    init();
  };

  $scope.remove = function (error) {
    Errors.remove(error);
    init();
  };

  $scope.clear = function () {
    Errors.clear();
    init();
  };

  var sounds = {
    kick: new Howl({
      urls: ['audio/timpani.wav']
    }),
    snare: new Howl({
      urls: ['audio/snare.wav']
    })
  };

  $scope.note = function (name) {
    sounds[name].play();
  };

});
