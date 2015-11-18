'use strict';

var React = require('react-native');
var {
  View,
  StyleSheet,
  ScrollView,
  AlertIOS
} = React;

var t = require('tcomb-form-native');
var Form = t.form.Form;

var Button = require('./Button');

var CATEGORIES = require('../Constants/Categories');
var VEGAN_LEVELS = require('../Constants/VeganLevels');

var categoryEnums = {};
var veganLevelEnums = {};

CATEGORIES.forEach((c) => { categoryEnums[c] = c; });
VEGAN_LEVELS.forEach((l, i) => { 
  if (i === 0) { return; } // Don't add vegan level 0.
  veganLevelEnums[i] = l.short; 
}); // TODO: File bug for not sending string to enum.

var Category = t.enums(categoryEnums);
var VeganLevel = t.enums(veganLevelEnums);
var OnlineStore = t.enums({
  y: 'Online',
  n: 'Physical',
  both: 'Both'
});
// var Owner = t.enums({
//   vegetarian: 'Vegetarian',
//   vegan: 'Vegan',
//   not_sure: 'Not sure'
// });
var Tag = t.refinement(t.String, (s) => {
  return s.includes(' ') ? s.includes(',') : true;
});
var PhoneNumber = t.refinement(t.String, (s) => {
  return s.startsWith('+61');
});

var defaults = {
  online_store: 'both',
  vegan_level: '4'
};


var Listing = t.struct({
  name: t.String,
  description: t.String,
  tags: Tag,
  phone_number: PhoneNumber,
  vegan_level: VeganLevel,
  categories: Category,
  online_store: OnlineStore
});

var formOptions = {
  fields: {
    name: {
      placeholder: 'eg. Dessert Place'
    },
    description: {
      placeholder: 'eg. A great place that offers dessert'
    },
    phone_number: {
      placeholder: 'eg. +61 9898 0000',
      keyboardType: 'phone-pad',
      error: (value) => value ? '' : 'Phone numbers must start with +61'
    },
    tags: {
      keyboardType: 'twitter',
      placeholder: 'eg. #cake, #dessert',
      error: (value) => (value && value.length === 0) ? '' : 'Separate multiple tags with commas'
    },
    vegan_level: {
      nullOption: false
    },
    online_store: {
      label: 'Business Type',
      nullOption: false
    },
    owner_is_a: {
      nullOption: false
    }
  }
};

class AddListing extends React.Component {
  _formPressed() {
    var valid = this.refs.form.getValue();
    if (valid) {
      AlertIOS.alert('Hooray!', 'Your listing has been added!', [{ text: 'OK', onPress: () => this.props.navigator.pop() }]);
    } else {
      AlertIOS.alert('Uh oh!', 'Sorry, there were errors with your listing!');
    }
  }
  render() {
    return (
      <ScrollView style={styles.container} keyboardDismissMode='on-drag'>
        <Form
          value={defaults}
          options={formOptions}
          ref='form'
          type={Listing}
        />
        <View style={styles.buttonContainer}>
          <Button onPress={this._formPressed.bind(this)}>Add your listing</Button>
        </View>
      </ScrollView>
    );
  }
}

AddListing.propTypes = {
  navigator: React.PropTypes.object.isRequired
};

var styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
    marginBottom: 16
  },
  buttonContainer: {
    alignItems: 'center'
  }
});

module.exports = AddListing;
