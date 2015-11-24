'use strict';

var React = require('react-native');
var {
  Image,
  View,
  Platform,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  ActionSheetIOS,
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
  phone_number: t.maybe(PhoneNumber),
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
      placeholder: 'eg. A great place that offers dessert',
      multiline: true,
      numberOfLines: 3
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
    }
  }
};

class AddListing extends React.Component {
  constructor() {
    super();
    this.state = {
      images: [],
      isOnlineStore: false,
      formValue: defaults
    };
  }

  _onFormChanged(raw) {
    var isOnlineStore = raw.online_store === 'y';

    console.log('isOnlineStore', isOnlineStore);
    this.setState({
      formValue: raw,
      isOnlineStore
    });
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

  _imagePressed(imageIndex) {
    var BUTTONS = ['Delete', 'Cancel']; 

    ActionSheetIOS.showActionSheetWithOptions({
      options: BUTTONS,
      cancelButtonIndex: 1,
      destructiveButtonIndex: 0
    },
    (buttonIndex) => {
      if (buttonIndex != 0) { return ; } // We only want the delete button.

      var images = this.state.images;
      images.splice(imageIndex, 1);

      this.setState({ images });
    });
  }

  addressForm() {
    if (this.state.isOnlineStore) {
      return false;
    }

    var that = this;
    var API_KEY = 'AIzaSyAgb2XoUPeXZP3jKAqhaWX-D5rfkyIIi7E';
    var GooglePlacesAutocomplete = require('react-native-google-places-autocomplete').create({
      placeholder: 'Start typing an address',
      fetchDetails: true,
      styles: { textInput: t.form.Form.stylesheet.textbox.normal },
      onPress(place, placeDetails) {
        if (place === null) { 
          that.props.onLocationSelected(null); 
          return;
        }

        var geometry = placeDetails.geometry.location;
        geometry = {
          latitude: geometry.lat,
          longitude: geometry.lng
        };
        var location = {
          geometry,
          name: placeDetails.name
        };

        that.props.onLocationSelected(location);
      },
      minLength: 2,
      query: {
        key: API_KEY,
        language: 'en',
        types: 'geocode'
      }
    }).bind(this);

    return (
      <View>
        <Text style={t.form.Form.stylesheet.controlLabel.normal}>Address</Text>
        <GooglePlacesAutocomplete />
      </View>
    );
  }

  imagePicker() {
    if (this.state.images.length > 2) {
      return false;
    }

    if (this.state.images.length < 1) { 
      return (
        <TouchableOpacity style={styles.addImageContainer} onPress={this._addImagePressed.bind(this)}>
          <Icon color={COLOURS.GREY} size={80} name='image' />
          <Text style={styles.addImageText}>Add Image</Text>
        </TouchableOpacity>
      );
    }

    if (this.state.images.length > 0) {
      return (
        <TouchableOpacity style={styles.addImageContainer} onPress={this._addImagePressed.bind(this)}>
          <Icon color={COLOURS.GREY} size={64} name='plus' />
        </TouchableOpacity>
      );
    }
  }

  renderImage(source, imageIndex) {
    return (
      <TouchableOpacity activeOpacity={0.9} onPress={this._imagePressed.bind(this, imageIndex)} key={imageIndex}>
        <Image style={styles.image} source={source} />
      </TouchableOpacity>
    );
  }

  render() {
    console.log('Images!', this.state.images);
    return (
      <ScrollView style={styles.container} keyboardDismissMode='on-drag'>
        <View style={styles.images}>
          { this.state.images.map((i, k) => this.renderImage(i, k)) }
          { this.imagePicker() }
        </View>
        <Form
          onChange={this._onFormChanged.bind(this)}
          value={this.state.formValue}
          options={formOptions}
          ref='form'
          type={Listing}
        />
        { this.addressForm() }
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
  addImageText: {
    color: COLOURS.GREY,
    fontWeight: 'bold'
  },
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
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    width: imageSize,
    height: imageSize,
    margin: 8
  },
  addImageContainer: {
    backgroundColor: COLOURS.LIGHT_GREY,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    width: imageSize,
    height: imageSize,
    margin: 8
  }
});


module.exports = AddListing;
