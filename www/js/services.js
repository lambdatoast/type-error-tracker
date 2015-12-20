/// <reference path="../definitions/angularjs/angular.d.ts" />
;
angular.module('starter.services', [])
    .factory('moment', function ($window) {
    return $window.moment;
})
    .factory('Error', function ($window) {
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
        }
        catch (e) {
            return [];
        }
    }
    function getById(id) {
        var xs = load().filter(function (e) {
            return e.id + '' === id + '';
        });
        if (xs.length) {
            return xs[0];
        }
        else {
            throw new Error('Did not find error with ID of: ' + id);
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
    function update(newError) {
        var errors = load().map(function (e) {
            return e.id === newError.id ? newError : e;
        });
        $window.localStorage.setItem('errors', JSON.stringify(errors));
    }
    var typeSystemFeatures = {
        nominal: { checked: false },
        structural: { checked: false },
        polymorphic: { checked: false },
        existential: { checked: false },
        phantom: { checked: false },
        liquid: { checked: false },
        dependent: { checked: false },
        linear: { checked: false }
    };
    function is(type) { return function (error) { return error.type === type; }; }
    return {
        all: load,
        save: save,
        clear: clear,
        remove: remove,
        update: update,
        getById: getById,
        typeSystemFeatures: typeSystemFeatures,
        is: is
    };
})
    .factory('Cost', function (Error) {
    // [Error] -> String
    function totalHours(errors) {
        return Number(errors.reduce(function (acc, err) {
            var cost = Number(err.cost);
            return acc + (err.unit === 'hrs' ? cost : cost / 60);
        }, 0)).toFixed(2);
    }
    function totals(errors) {
        return {
            Type: totalHours(errors.filter(Error.is('Type'))),
            Other: totalHours(errors.filter(Error.is('Other')))
        };
    }
    return {
        totals: totals
    };
});
