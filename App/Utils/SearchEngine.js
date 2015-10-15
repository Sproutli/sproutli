'use strict';

var ListingsFilter = require('./ListingsFilter');

var SearchEngine = {
  filter(listings, searchConfig) {
    console.log(listings.hits.hit[0].fields);
    return listings.hits.hit
      .map((l) => l.fields)
      .filter((l) => ListingsFilter.filter(l, searchConfig));
  },

  search(query, location, searchConfig) {
    query = query || '-aaoidwjaoiwdjaijwd';
    var url = `http://search-sproutli-bhzq3vdfhs5jhshdoqqt67ru5a.ap-southeast-2.cloudsearch.amazonaws.com/2013-01-01/search?q=${query}&size=20&expr.distance=haversin(${location.latitude},${location.longitude},location.latitude,location.longitude)&sort=distance asc`;

    return fetch(url)
      .then((res) => res.json())
      .then((listings) => {
        return new Promise((resolve, reject) => {
          listings = this.filter(listings, searchConfig);
          resolve(listings);
        });
      })
      .catch((error) => {
        console.warn('Error fetching listings', error);
      });
  }
}

module.exports = SearchEngine;
