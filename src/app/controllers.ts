angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, Error : ErrorModule, Cost) {
  $scope.$on('$ionicView.enter', function(e) {
    var errors : Array<Identified<TE>> = Error.all();
    $scope.errors = errors;
    $scope.errorCount = $scope.errors.length;
    $scope.hours = Cost.totals($scope.errors);
    var typeSystemFeaturesDemand = $scope.errors.filter(Error.is('Type')).reduce(function (acc, e) {
      return Object.keys(e.typeSystemFeatures).reduce(function (acc, feature) {
        acc[feature] = acc[feature] !== undefined ? acc[feature] : 0;
        acc[feature] = acc[feature] + (e.typeSystemFeatures[feature].checked === true ? 1 : 0);
        return acc;
      }, acc);
    }, {});
    $scope.typeSystemFeaturesDemand = Object.keys(typeSystemFeaturesDemand).reduce(function (acc, feature) {
      acc.labels = acc.labels.concat([feature.toUpperCase().slice(0,1) + feature.slice(1) + ' types']);
      acc.data = acc.data.concat([typeSystemFeaturesDemand[feature]]);
      return acc;
    }, {labels: [], data: []});
    $scope.showTypeSystemFeaturesDemand = $scope.typeSystemFeaturesDemand.data.some(function (n) { return n > 0; });
  });
})

.controller('ErrorsCtrl', function($scope, $state, Error : ErrorModule, $ionicPopup) {

  var newError : TE = {
    type: 'Type',
    cost: 1,
    unit: 'min',
    typeSystemFeatures: Error.typeSystemFeatures
  };

  $scope.newError = newError;

  $scope.add = function () {
    Error.save({
      type: $scope.newError.type, 
      cost: $scope.newError.cost,
      unit: $scope.newError.unit,
      typeSystemFeatures: $scope.newError.typeSystemFeatures
    });
    $state.go('tab.history');
  };

  $scope.clear = function () {
    var confirmPopup = $ionicPopup.confirm({
      title: 'Clear records',
      template: 'Are you sure you want to remove all records?'
    });
    confirmPopup.then(function(res) {
      if(res) {
        Error.clear();
      } else {
      }
    });
  };

})

.controller('ErrorsEditCtrl', function($scope, $state, error, Error) {
  $scope.error = error;
  $scope.typeSystemFeatures = Object.keys(error.typeSystemFeatures);
  $scope.update = function () {
    Error.update($scope.error);
    $state.go('tab.history');
  };
})

.controller('HistoryCtrl', function($scope, $state, Error, Cost, $ionicPopup, moment) {
  $scope.errors = [];
  $scope.history = [];

  function init() {
    $scope.errors = Error.all().concat([]).reverse();
    $scope.history = createHistory($scope.errors);
  }

  function createHistory(errors) {
    var FORMAT = 'YYYY-MM-DD';
    var map = errors.reduce(function (acc, e) {
      var day = moment(new Date(e.id)).format(FORMAT);
      acc[day] = acc[day] ? acc[day].concat([e]) : [e];
      return acc;
    }, {});
    return Object.keys(map).sort(function (date1, date2) {
      return moment(date1, FORMAT).isBefore(moment(date2, FORMAT)) ? -1 : 1;
    }).map(function (k) {
      var costs = Cost.totals(map[k]);
      return { 
        day: k, 
        errors: map[k], 
        //costs: Cost.totals(map[k])
        costs: Object.keys(costs).reduce(function (acc, k) {
          return acc.concat([{type: k, cost: costs[k]}]);
        }, [])
      };
    }).reverse();
  }

  $scope.$on('$ionicView.enter', function(e) {
    init();
  });

  $scope.remove = function (error) {
    var confirmPopup = $ionicPopup.confirm({
      title: 'Remove',
      template: 'Are you sure you want to remove this record?'
    });
    confirmPopup.then(function(res) {
      if(res) {
        Error.remove(error);
        init();
      } else {
      }
    });
  };

});
