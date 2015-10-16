'use strict';

var ListingsFilter = {
  filter(listing, filterBy) {
    if (typeof(listing) === 'undefined') {
      return [];
    }

    // Helpers
    var f = filterBy,
    // Make string checking ignore case
    strEquals = function(a, b) {
      try {
        a = a.replace(/ /g, '');
        b = b.replace(/ /g, '');
        return a.toUpperCase() === b.toUpperCase();
      } catch(e) {
        // Do nothing, we don't care, they don't equal or the data is corrupt
      }

      return false;
    },

    /* Match the categories. Logic is: return true
       IF the listing has at >1 category that is checked in `filterBy.categories`
       OR
       IF `filterBy.categories` has no checked categories */
    hasCategories = function(listing) {
      var categories = f.categories.filter(function(category) {
          return category.check;
          });

      var category;

      // Return true if no categories have been switched on
      if(!categories.length) {
        return true;
      }

      categories = categories.map(function(category) {
        return category.name;
      });

      // Return false if listing has no categories
      if(!listing.categories) {
        return false;
      }

      // Make sure that checked categories exist on this listing.
      for(var i = 0, k = categories.length; i < k; i++) {
        category = categories[i];

        if (listing.categories.indexOf(category) !== -1) {
          return true;
        }
      }

      // Fall through - return false.
      return false;
    },

    // If it has a discount OR we don't care if it has a discount
    hasDiscount = function(listing) {
      return listing.discount || !f.discount;
    },

    // Return same as filtered, if no filter is specified, return true
    hasCorrectOwner = function(listing) {

      var areSame = f.owner_is === listing.owner_is;
      var areEither = listing.owner_is === 'vegan' ||
        listing.owner_is === 'vegetarian';

      switch (f.owner_is) {
        case 'vegan':
          return areSame;
        case 'vegetarian':
          return areSame;
        case 'both':
          return areEither;
        default:
          return true;
      }
    },

    hasCorrectVeganLevel = function(listing) {
      var veganLevelIsGreater = listing.vegan_level >= Math.round(f.vegan_level),
      hasNoVeganLevel = f.vegan_level == 0 && !listing.vegan_level; //jshint ignore:line

      return veganLevelIsGreater || hasNoVeganLevel;
    },

    hasCorrectTags = function(listing) {
      // Guard
      if (!f.tags || f.tags.length === 0) { return true; }

      if (!listing.tags) { return false; }

      var hasTags = false;
      f.tags.forEach(function(filterTag) {
        listing.tags.forEach(function(listingTag) {
          if (strEquals(filterTag, listingTag)) { hasTags = true; }
        });
      });

      return hasTags;
    },

    hasOffer = function(listing) {
      // Guard
      if (!f.hasOffer) { return true; }

      return listing.offer_details;
    },

    hasCorrectBusinessType = function(listing) {
      var unspecified = !f.online_store,
      filterIsBoth = strEquals(f.online_store, 'BOTH'),
      listingIsBoth = strEquals(listing.online_store, 'BOTH'),
      bothAreEqual = strEquals(listing.online_store, f.online_store);

      return unspecified || filterIsBoth || listingIsBoth || bothAreEqual;
    };

    var l = listing;
    return (hasDiscount(l) &&
            hasCorrectOwner(l) &&
            hasCorrectVeganLevel(l) &&
            hasCorrectBusinessType(l) &&
            hasCorrectTags(l) &&
            hasOffer(l) &&
            hasCategories(l));
  }
}

module.exports = ListingsFilter;
