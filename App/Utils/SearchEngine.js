'use strict';

function getBoundingBox(latlng, distance) {
  var EARTH_RADIUS_KM = 6371.01, // Earth's radius in km
      DEG2RAD = Math.PI / 180,
      RAD2DEG = 180 / Math.PI,
      MAX_LAT = Math.PI / 2, // 90 degrees
      MIN_LAT = -MAX_LAT, // -90 degrees
      MAX_LON = Math.PI, // 180 degrees
      MIN_LON = -MAX_LON, // -180 degrees
      FULL_CIRCLE_RAD = Math.PI * 2,
      inKilometers = true,
      radius = EARTH_RADIUS_KM;

  var lat = latlng.latitude * DEG2RAD,
      lon = latlng.longitude * DEG2RAD, 
      radDist = distance / radius,
      minLat = lat + radDist,
      maxLat = lat - radDist,
      minLon,
      maxLon,
      deltaLon;

  if (minLat > MIN_LAT && maxLat < MAX_LAT) {
    deltaLon = Math.asin(Math.sin(radDist) / Math.cos(lat));
    minLon = lon - deltaLon;
    if (minLon < MIN_LON) {
      minLon += FULL_CIRCLE_RAD;
    }
    maxLon = lon + deltaLon;
    if (maxLon > MAX_LON) {
      maxLon -= FULL_CIRCLE_RAD;
    }
  } else {
    // Freakishly, we're in the North or South Pole. Who knew?
    minLat = Math.max(minLat, MIN_LAT);
    maxLat = Math.min(maxLat, MAX_LAT);
    minLon = MIN_LON;
    maxLon = MAX_LON;
  }

  return { 
    se: [minLat * RAD2DEG, minLon * RAD2DEG], 
    nw: [maxLat * RAD2DEG, maxLon * RAD2DEG ]
  };
}

var prepareReturnFields = (location) => {
  var props = [
    'rating',
    'description',
    'tags',
    'location',
    'images',
    'id',
    'name',
    'address_line_1',
    'administrative_area_level_1',
    'postcode',
    'locality',
    'vegan_level',
    'online_store',
    'categories',
    'phone_number',
    'website',
    'cover_image',
    'premium',
    'offer_details',
    'offer_instructions',
    'offer_conditions'
  ];

  if (location && location.latitude) { props.push('distance'); }

  return props.join(',');
};

var parse = (listings, location) => { 
  var response = listings.hits.hit
    .map((l) => {
      return({...l.fields, distance: l.exprs ? l.exprs.distance : null});
    });

  return response;
};

var prepareLocationExpression = (location) => {
  if (!location || !location.latitude) { return ''; }

  return `haversin(${location.latitude},${location.longitude},location.latitude,location.longitude)`;
};

var prepareFilterQuery = (location) => {
  if (!location || !location.latitude) { return ''; }
  const { se, nw } = getBoundingBox(location, 20);
  return `location:['${se.join(',')}','${nw.join(',')}']`;
};

var runSearch = (searchParams) => {
  var { query, parser, returnFields, sort, expr, size, fq } = searchParams;
  var url;



  if (expr && fq) {
    url = `http://search-sproutli-bhzq3vdfhs5jhshdoqqt67ru5a.ap-southeast-2.cloudsearch.amazonaws.com/2013-01-01/search?q=${query}&size=${size}&expr.distance=${expr}&return=${returnFields}&sort=${sort}&q.parser=${parser}&fq=${fq}`;
  } else {
    url = `http://search-sproutli-bhzq3vdfhs5jhshdoqqt67ru5a.ap-southeast-2.cloudsearch.amazonaws.com/2013-01-01/search?q=${query}&size=${size}&q.parser=${parser}`;
  }

  return fetch(url);
};



var SearchEngine = {
  search(query, location) {
    const SEARCH_PARAMS = {
      query: query ? `'${query.replace("'", "\\'")}'` : 'matchall',
      parser: 'structured',
      returnFields: prepareReturnFields(location),
      sort: 'distance asc',
      fq: prepareFilterQuery(location),
      expr: prepareLocationExpression(location),
      size: 1000,
    };

    return runSearch(SEARCH_PARAMS)
      .then((res) => res.json())
      .then((listings) => parse(listings, location))
      .catch((error) => {
        console.warn('[SearchEngine] - Error fetching listings', error);
      });
  }
};

module.exports = SearchEngine;
