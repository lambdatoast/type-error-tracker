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

.controller('ErrorsCtrl', function($scope, Errors, $ionicPopup) {

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
    unit: 'min',
    typeSystemFeatures: Errors.typeSystemFeatures
  };

  $scope.add = function () {
    Errors.save({
      type: $scope.newError.type, 
      cost: $scope.newError.cost,
      unit: $scope.newError.unit,
      typeSystemFeatures: $scope.newError.typeSystemFeatures
    });
    init();
  };

  $scope.remove = function (error) {
    Errors.remove(error);
    init();
  };

  $scope.clear = function () {
    var confirmPopup = $ionicPopup.confirm({
      title: 'Clear records',
      template: 'Are you sure you want to remove all records?'
    });
    confirmPopup.then(function(res) {
      if(res) {
        Errors.clear();
        init();
      } else {
      }
    });
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

})

.controller('ErrorsEditCtrl', function($scope, $state, error, Errors) {
  $scope.error = error;
  $scope.typeSystemFeatures = Object.keys(error.typeSystemFeatures);
  $scope.update = function () {
    Errors.update($scope.error);
    $state.go('tab.errors');
  };
});
