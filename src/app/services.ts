/// <reference path="../definitions/angularjs/angular.d.ts" />

namespace App {
  export interface HistoryEntry { day: string; errors: TE[]; costs: any[]; }
  export type History = HistoryEntry[];
}

type Identified<A> = A & {id: string};

interface TE {
    type: string;
    cost: number;
    unit: string;
    typeSystemFeatures: any;
}

interface Totals {
    Type: string;
    Other: string;
}

interface ErrorModule {
  all: () => Array<Identified<TE>>;
  save: (error: TE) => any;
  clear: () => any;
  remove: (x: Identified<TE>) => void;
  update: (x: Identified<TE>) => void;
  getById: (id) => any;
  typeSystemFeatures: Object;
  is: (s: string) => (x: {type: string}) => boolean;
};

function ErrorFactory($window): ErrorModule {

  function save(error) {
    error.id = +(new Date());
    var errors = all();
    errors.push(error);
    $window.localStorage.setItem('errors', JSON.stringify(errors));
  }

  function all() : Array<Identified<TE>> {
    try {
      var xs = JSON.parse($window.localStorage.getItem('errors'));
      return xs ? xs : [];
    } catch (e) {
      return [];
    }
  }

  function getById(id: string): Identified<TE> {
    var xs = all().filter(function (e) {
      return e.id+'' === id+'';
    });
    if (xs.length) {
      return xs[0];
    } else {
      throw new Error('Did not find error with ID of: ' + id);
    }
  }

  function clear() {
    $window.localStorage.removeItem('errors');
  }

  function remove(error: Identified<TE>): void {
    var errors = all().filter(function (e) {
      return e.id !== error.id;
    });
    $window.localStorage.setItem('errors', JSON.stringify(errors));
  }

  function update(newError: Identified<TE>) {
    var errors = all().map(function (e) {
      return e.id === newError.id ? newError : e;
    });
    $window.localStorage.setItem('errors', JSON.stringify(errors));
  }

  var typeSystemFeatures = {
    nominal: { checked: false },
    structural: { checked: false },
    polymorphic: { checked: false },
    existential: { checked: false },
    phantom: {checked: false },
    liquid: { checked: false },
    dependent: { checked: false },
    linear: { checked: false }
  };

  function is(type: string) { return function (a: {type: string}) { return a.type === type; }; }

  return {
    all: all,
    save: save,
    clear: clear,
    remove: remove,
    update: update,
    getById: getById,
    typeSystemFeatures: typeSystemFeatures,
    is: is
  };

}

angular.module('starter.services', [])

.factory('moment', function($window) {
  return $window.moment;
})

.factory('Error', ErrorFactory)

.factory('Cost', function(Error) {
  function totalHours(errors : Array<TE>) : string {
    return Number(errors.reduce(function (acc, err) {
      var cost = err.cost;
      return acc + (err.unit === 'hrs' ? cost : cost/60);
    }, 0)).toFixed(2);
  }
  function totals(errors) : Totals {
    return {
      Type: totalHours(errors.filter(Error.is('Type'))),
      Other: totalHours(errors.filter(Error.is('Other')))
    };
  }
  return {
    totals: totals
  };
})
