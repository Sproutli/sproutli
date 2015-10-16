'use strict';

var SearchEngine = {
  parse(listings) { 
    return listings.hits.hit.map((l) => l.fields);
  },

  prepareLocationQuery(location) {
    if (!location) { return ''; }

    return `&expr.distance=haversin(${location.latitude},${location.longitude},location.latitude,location.longitude)&sort=distance asc`
  },

  search(query, location) {
    query = query || '-aaoidwjaoiwdjaijwd';
    var locationQuery = this.prepareLocationQuery(location);
    var url = `http://search-sproutli-bhzq3vdfhs5jhshdoqqt67ru5a.ap-southeast-2.cloudsearch.amazonaws.com/2013-01-01/search?q=${query}&size=1000${locationQuery}`;

    return fetch(url)
      .then((res) => res.json())
      .then((listings) => this.parse(listings))
      .catch((error) => {
        console.warn('Error fetching listings', error);
      });
  }
}

module.exports = SearchEngine;
