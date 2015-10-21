'use strict';

var VEGAN_LEVELS =  [
  { abbreviation: 'PV', short: 'Possibly Vegan', long: 'Don\'t know if or how many products are vegan.' },
  { abbreviation: 'CV', short: 'Can Veganise', long: 'No vegan items, but can veganise at least one main meal.' },
  { abbreviation: 'VF', short: 'Vegan Friendly', long: 'At least one product/meal is vegan.' },
  { abbreviation: 'VVF', short: 'Very Vegan Friendly', long: 'More than 5 vegan items.' },
  { abbreviation: 'MV', short: 'Mostly Vegan', long: '100% Vegetarian, more than 5 vegan products/meals.' },
  { abbreviation: 'V', short: '100% Vegan', long: 'All products and meals are vegan! Woohoo!' }
];

module.exports = VEGAN_LEVELS;
