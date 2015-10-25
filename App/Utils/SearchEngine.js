/* global fetch */
'use strict';

var prepareProps = (location) => {
  var props = [
    'rating',
    'description',
    'tags',
    'location',
    'images',
    'id',
    'name',
    'locality',
    'vegan_level',
    'online_store',
    'categories',
    'owner_is',
    'phone_number',
    'website',
    'premium',
    'cover_image',
    'offer_details',
    'offer_instructions',
    'offer_conditions'
  ];

  if (location && location.latitude) { props.push('distance'); }

  return props.join(',');
};

var parse = (listings, location) => { 
  return listings.hits.hit
  .filter((l) => {
    if (!location || !location.latitude) { return true; }

    l.fields.distance = l.exprs.distance;

    return l.fields.distance < 20;
  })
  .map((l) => l.fields);
};

var SearchEngine = {
  prepareLocationQuery(location) {
    if (!location || !location.latitude) { return ''; }

    return `&expr.distance=haversin(${location.latitude},${location.longitude},location.latitude,location.longitude)&sort=distance asc&return=${prepareProps(location)}`;
  },

  search(query, location) {
    console.log('Searching', query, location);
    query = query || '-aaoidwjaoiwdjaijwd';
    var locationQuery = this.prepareLocationQuery(location);
    var url = `http://search-sproutli-bhzq3vdfhs5jhshdoqqt67ru5a.ap-southeast-2.cloudsearch.amazonaws.com/2013-01-01/search?q=${query}&size=1000${locationQuery}`;

    return fetch(url)
      .then((res) => res.json())
      .then((listings) => parse(listings, location))
      .catch((error) => {
        console.warn('[SearchEngine] - Error fetching listings', error);
      });
  }
};

module.exports = SearchEngine;
