'use strict';

var CATEGORIES = require('./Categories');

var categories = () => {
  return CATEGORIES.map((c) => { 
    return { name: c, check: false }
  });
};

var productCategories = categories().map((c) => { 
  c.check = !(c.name === 'Food Stores' || 
              c.name === 'Cafes & Restaurants' || 
              c.name === 'Professional Services & Trades' || 
              c.name === 'Coaching & Classes' ||
              c.name === 'Entertainment' ||
              c.name === 'Accommodation' ||
              c.name === 'Hair & Beauty');
  return c;
});


var makeSearchConfig = (config) => {
  var baseSearchConfig = {
    discount: false,
    online_store: 'BOTH',
    vegan_level: 1,
    owner_is: '',
    categories: categories()
  }; 

  config = Object.assign(baseSearchConfig, config);
  return config;
};


var SUGGESTIONS = {
  initial: [
    {
      label: 'Food', 
      icon: 'pizza'
    },
    {
      label: 'Products', 
      icon: 'ios-cart'
    },
    {
      label: 'Services', 
      icon: 'ios-people'
    }
  ],

  'Food': [
    {
      label: 'Places to eat', 
      icon: 'fork',
      vegan_level: 4,
      searchConfig: makeSearchConfig({
        vegan_level: 4,
        categories: categories().map((c) => { 
          c.check = c.name === 'Cafes & Restaurants';
          return c;
        })
      })
    },
    {
      label: 'Online', 
      icon: 'earth',
      searchConfig: makeSearchConfig({
        categories: categories().map((c) => { 
          c.check = c.name === 'Food Stores';
          return c;
        }),
        online_store: 'Y',
        vegan_level: 4
      })
    },
    {
      label: 'In-store', 
      icon: 'bag',
      searchConfig: makeSearchConfig({
        categories: categories().map((c) => { 
          c.check = c.name === 'Food Stores';
          return c;
        }),
        online_store: 'N',
        vegan_level: 4
      })
    },
  ],

  'Products': [
    {
      label: 'Online', 
      icon: 'earth',
      searchConfig: makeSearchConfig({
        categories: productCategories,
        online_store: 'Y',
        vegan_level: 4
      })
    },
    {
      label: 'In-store', 
      icon: 'bag',
      searchConfig: makeSearchConfig({
        categories: productCategories,
        online_store: 'N',
        vegan_level: 4
      })
    },
  ],

  'Services': [
    {
      label: 'Hairdressers',
      icon: 'scissors',
      searchConfig: makeSearchConfig({
        categories: categories().map((c) => { 
          c.check = c.name === 'Professional Services & Trades';
          return c;
        }),
        tags: ['hairdresser']
      })
    },
    {
      label: 'Medical',
      icon: 'ios-medkit',
      searchConfig: makeSearchConfig({
        categories: categories().map((c) => { 
          c.check = c.name === 'Professional Services & Trades';
          return c;
        })
      }),
      tags: ['dentist', 'doctor']
    }, 
    {
      label: 'All services',
      icon: 'ios-people',
      searchConfig: makeSearchConfig({
        categories: categories().map((c) => { 
          c.check = c.name === 'Professional Services & Trades';
          return c;
        })
      }),
    }
  ]
};

module.exports = SUGGESTIONS;
