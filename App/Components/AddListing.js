'use strict';

var React = require('react-native');
var {
  StyleSheet,
  ScrollView
} = React;

var t = require('tcomb-form-native');
var Form = t.form.Form;

var CATEGORIES = require('../Constants/Categories');
var VEGAN_LEVELS = require('../Constants/VeganLevels');

var categoryEnums = {};
var veganLevelEnums = {};

CATEGORIES.forEach((c) => { categoryEnums[c] = c; });
VEGAN_LEVELS.forEach((l, i) => { veganLevelEnums[i] = l.short; });

var Category = t.enums(categoryEnums);
var VeganLevel = t.enums(veganLevelEnums);


var Listing = t.struct({
  name: t.String,
  categories: Category,
  description: t.String,
  tags: t.Array,
  vegan_level: VeganLevel
});

class AddListing extends React.Component {
  render() {
    return (
      <ScrollView style={styles.container}>
        <Form
          ref='form'
          type={Listing}
        />
      </ScrollView>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8
  }
});

module.exports = AddListing;
