angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

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

.controller('ErrorsCtrl', function($scope, $window) {

  function save(errors) {
    $window.localStorage.setItem('errors', JSON.stringify(errors));
  }

  function load() {
    try {
      return JSON.parse($window.localStorage.getItem('errors'));

    } catch (e) {
      return [];
    }
  }

  $scope.errors = load();

  $scope.newError = {
    type: 'Type',
    cost: 1,
    unit: 'min'
  };

  $scope.add = function () {
    $scope.errors.push({
      type: $scope.newError.type, 
      cost: $scope.newError.cost,
      unit: $scope.newError.unit
    });
    save($scope.errors);
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
