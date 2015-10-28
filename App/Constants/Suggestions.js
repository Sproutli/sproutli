'use strict';

var CATEGORIES = require('./Categories');
var Extend = require('extend');

var categories = () => {
  return CATEGORIES.map((c) => { 
    return { name: c, check: false };
  });
};

var productCategories = categories().map((c) => { 
  c.check = !(c.name === 'Cafes & Restaurants' || 
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
    vegan_level: 4,
    owner_is: '',
    categories: categories()
  }; 

  var newConfig = Extend(true, baseSearchConfig, config);
  return newConfig;
};


var SUGGESTIONS = {
  'Food': {
    label: 'Places to eat', 
    icon: 'fork',
    vegan_level: 4,
    searchConfig: makeSearchConfig({
      categories: categories().map((c) => { 
        c.check = c.name === 'Cafes & Restaurants';
        return c;
      })
    })
  },

  'Shops':  {
    label: 'In-store', 
    icon: 'bag',
    searchConfig: makeSearchConfig({
      categories: productCategories,
      online_store: 'N'
    })
  },

  'Online':  {
    label: 'In-store', 
    icon: 'bag',
    searchConfig: makeSearchConfig({
      categories: productCategories,
      online_store: 'Y'
    })
  },

  'Services': {
    label: 'All services',
    icon: 'ios-people',
    searchConfig: makeSearchConfig({
      categories: categories().map((c) => { 
        c.check = c.name === 'Professional Services & Trades';
        return c;
      })
    })
  }
};

module.exports = SUGGESTIONS;
