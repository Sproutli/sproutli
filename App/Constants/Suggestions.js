'use strict';

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
    },
    {
      label: 'Online', 
      icon: 'earth',
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
