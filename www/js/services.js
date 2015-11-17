angular.module('starter.services', [])

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'img/ben.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'img/max.png'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'img/adam.jpg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'img/perry.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'img/mike.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
})

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
