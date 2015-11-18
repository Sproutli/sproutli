'use strict';

var React = require('react-native');
var {
  Image,
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  AlertIOS
} = React;

var Dimensions = require('Dimensions');
var UIImagePickerManager = require('NativeModules').UIImagePickerManager;
var t = require('tcomb-form-native');
var Icon = require('react-native-vector-icons/Ionicons');
var Form = t.form.Form;

var Button = require('./Button');

var CATEGORIES = require('../Constants/Categories');
var VEGAN_LEVELS = require('../Constants/VeganLevels');
var COLOURS = require('../Constants/Colours');

var categoryEnums = {};
var veganLevelEnums = {};

var { width } = Dimensions.get('window');
var imageSize = width / 3 - 16;

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

t.form.Form.stylesheet.controlLabel.normal.color = COLOURS.GREY;

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
  constructor() {
    super();
    this.state = {
      images: []
    };
  }
  _formPressed() {
    var valid = this.refs.form.getValue();
    if (valid) {
      AlertIOS.alert('Hooray!', 'Your listing has been added!', [{ text: 'OK', onPress: () => this.props.navigator.pop() }]);
    } else {
      AlertIOS.alert('Uh oh!', 'Sorry, there were errors with your listing!');
    }
  }

  _addImagePressed() {
    var options = {
      title: 'Select Image', // specify null or empty string to remove the title
      cancelButtonTitle: 'Cancel',
      takePhotoButtonTitle: 'Take Photo...', // specify null or empty string to remove this button
      chooseFromLibraryButtonTitle: 'Choose from Library...', // specify null or empty string to remove this button
      quality: 1,
      allowsEditing: true, // Built in iOS functionality to resize/reposition the image
      noData: false, // Disables the base64 `data` field from being generated (greatly improves performance on large photos)
      storageOptions: { // if this key is provided, the image will get saved in the documents directory (rather than a temporary directory)
        skipBackup: true, // image will NOT be backed up to icloud
        path: 'images' // will save image at /Documents/images rather than the root
      }
    };

    UIImagePickerManager.showImagePicker(options, (didCancel, response) => {
      if (didCancel) { return ; }
      var source = {uri: response.uri.replace('file://', ''), isStatic: true};
      var images = this.state.images;
      images.push(source);

      this.setState({ images });
    });
  }

  imagePicker() {
    if (this.state.images.length > 2) {
      return false;
    }

    if (this.state.images.length < 1) { 
      return (
        <TouchableOpacity style={styles.image} onPress={this._addImagePressed.bind(this)}>
          <Icon color={COLOURS.GREY} size={80} name='image' />
          <Text style={{color: COLOURS.GREY}}>Add image</Text>
        </TouchableOpacity>
      );
    }

    if (this.state.images.length > 0) {
      return (
        <TouchableOpacity style={styles.image} onPress={this._addImagePressed.bind(this)}>
          <Icon color={COLOURS.GREY} size={64} name='plus' />
        </TouchableOpacity>
      );
    }
  }

  render() {
    console.log('Images!', this.state.images);
    return (
      <ScrollView style={styles.container} keyboardDismissMode='on-drag'>
        <View style={styles.images}>
          { this.state.images.map((i, k) => <Image style={styles.image} key={k} source={i} />) }
          { this.imagePicker() }
        </View>
        <Form
          value={defaults}
          options={formOptions}
          ref='form'
          type={Listing}
        />
        <View style={styles.buttonContainer}>
          <Button onPress={this._formPressed.bind(this)}>Add listing</Button>
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
  },
  images: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16
  },
  image: {
    justifyContent: 'center',
    alignItems: 'center',
    width: imageSize,
    height: imageSize,
    margin: 8
  }
});

module.exports = AddListing;
