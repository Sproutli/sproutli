'use strict';

var CATEGORIES = require('./Categories');

var categories = CATEGORIES.map(function(category) {
  return { name: category, check: false };
});


var makeSearchConfig = (config) => {
  var baseSearchConfig = {
      discount: false,
      online_store: 'BOTH',
      vegan_level: 1,
      owner_is: '',
      categories: categories
  }; 

  return Object.assign(config, baseSearchConfig);
}

var SUGGESTIONS = {
  initial: [
    {
      label: 'Food', 
      icon: 'pizza',
    },
    {
      label: 'Products', 
      icon: 'ios-cart',
    },
    {
      label: 'Services', 
      icon: 'ios-people',
    }
  ],

  'Food': [
    {
      label: 'Places to Eat', 
      icon: 'fork',
      searchConfig: makeSearchConfig({
        categories: categories.map((c) => { 
          c.check = c.name === 'Cafes & Restaurants';
          return c;
        })
      })
    },
    {
      label: 'Online', 
      icon: 'earth',
      searchConfig: makeSearchConfig({
        categories: categories.map((c) => { 
          c.check = c.name === 'Cafes & Restaurants';
          return c;
        }),
        online_store: 'Y',
        vegan_level: 4
      })
    },
    {
      label: 'In-store', 
      icon: 'bag',
    },
  ],

  'Products': [
    {
      label: 'Online', 
      icon: 'earth',
    },
    {
      label: 'In-store', 
      icon: 'bag',
    },
  ],

  'Services': [
    {
      label: 'Hairdressers',
      icon: 'scissors'
    },
    {
      label: 'Medical',
      icon: 'ios-medkit',
    }, 
    {
      label: 'Other',
      icon: 'ios-people'
    }
  ]
};

module.exports = SUGGESTIONS;
