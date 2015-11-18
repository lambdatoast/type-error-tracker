angular.module('starter.services', [])

.factory('Errors', function($window) {

  function save(error) {
    error.id = +(new Date());
    var errors = load();
    errors.push(error);
    $window.localStorage.setItem('errors', JSON.stringify(errors));
  }

  function load() {
    try {
      var xs = JSON.parse($window.localStorage.getItem('errors'));
      return xs ? xs : [];
    } catch (e) {
      return [];
    }
  }

  function clear() {
    $window.localStorage.removeItem('errors');
  }

  function remove(error) {
    var errors = load().filter(function (e) {
      return e.id !== error.id;
    });
    $window.localStorage.setItem('errors', JSON.stringify(errors));
  }

  return {
    all: load,
    save: save,
    clear: clear,
    remove: remove
  };

});
