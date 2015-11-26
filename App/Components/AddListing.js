/* @flow */
'use strict';

var React = require('react-native');
var {
  Image,
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  ActionSheetIOS,
  AlertIOS
} = React;

// Dimensions
var Dimensions = require('Dimensions');
var { width } = Dimensions.get('window');
var imageSize = width / 3 - 16;

// Image Picker
var UIImagePickerManager = require('NativeModules').UIImagePickerManager;

// Form
var t = require('tcomb-form-native');
var Form = t.form.Form;
var categoryEnums = {};
var veganLevelEnums = {};

// Icon
var Icon = require('react-native-vector-icons/Ionicons');

// Google Places
var { GooglePlacesAutocomplete } = require('react-native-google-places-autocomplete');
var API_KEY = 'AIzaSyAgb2XoUPeXZP3jKAqhaWX-D5rfkyIIi7E';

// Components
var Button = require('./Button');
var ListingDetail = require('./ListingDetail');
var LoadingScreen = require('./LoadingScreen');

// Utils
var CreateListing = require('../Utils/CreateListing');

// Constants
var CATEGORIES = require('../Constants/Categories');
var VEGAN_LEVELS = require('../Constants/VeganLevels');
var COLOURS = require('../Constants/Colours');

CATEGORIES.forEach((c) => { categoryEnums[c] = c; });
VEGAN_LEVELS.forEach((l, i) => { 
  if (i === 0) { return; } // Don't add vegan level 0.
  veganLevelEnums[i] = l.short; 
}); // TODO: File bug for not sending string to enum.

var Category = t.enums(categoryEnums);
var VeganLevel = t.enums(veganLevelEnums);
var OnlineStore = t.enums({
  'Y': 'Online',
  'N': 'Physical',
  'BOTH': 'Both'
});
var PhoneNumber = t.refinement(t.String, (s) => {
  return s.startsWith('+61');
});

var defaults = {
  name: `Kane's Place`,
  description: 'For Kane',
  online_store: 'BOTH',
  categories: ['Pets'],
  vegan_level: '4',
  tags: ['kane', 'test']
};


var Listing = t.struct({
  name: t.String,
  description: t.String,
  tags: t.Array,
  phone_number: t.maybe(PhoneNumber),
  website: t.maybe(t.String),
  vegan_level: VeganLevel,
  categories: Category,
  online_store: OnlineStore
});

t.form.Form.stylesheet.controlLabel.normal.color = COLOURS.GREY;

var arrayTransformer = {
  format: (value) => {
    return Array.isArray(value) ? value[0] : value;
  },

  parse: (string: string) => {
    return [string];
  }
}

var tagsTransformer = {
  format: (value) => {
    if (Array.isArray(value)) {
      return value.map((t) => '#' + t).join(', ');
    } else {
      return value.replace(/#/g, '').split(', ');
    }
  },

  parse: (value) => {
    if (Array.isArray(value)) {
      return value;
    } else {
      return value.replace(/#/g, '').split(', ');
    }
  }
}

var veganLevelTransformer = {
  format: (value: number) => {
    return String(value);
  },

  parse: (value: string) => {
    return Number(value);
  }
}

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
      transformer: tagsTransformer,
      placeholder: 'eg. #cake, #dessert',
      error: (value) => (value && value.length === 0) ? '' : 'Separate multiple tags with commas'
    },
    vegan_level: {
      nullOption: false,
      transformer: veganLevelTransformer
    },
    online_store: {
      label: 'Business Type',
      nullOption: false
    },
    categories: {
      transformer: arrayTransformer
    }
  }
};

class AddListing extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      location: {},
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

  _onListingCreated(listing) {
    this.setState({ loading: false });
    AlertIOS.alert(
      'Listing Added', 
      `${this.state.formValue.name} has been added! Would you like to share it on Facebook?`, 
      [
        { text: 'Yes', onPress: this.shareOnFacebook.bind(this, listing) },
        { text: 'No', onPress: this.navigateToNewListing.bind(this, listing) }
      ]
    );
  }

  shareOnFacebook(listing) {
    Facebook.shareListing(listing)
    .then(() => {
      AlertIOS.alert(
        'Sharing Complete',
        `Thanks for sharing ${listing.name}!`,
        [{ text: 'OK', onPress: this.navigateToNewListing.bind(this, listing) }]
      );
    })
    .catch((error) => {
      alert('Sorry, there was an error talking to Facebook!');
      console.warn('[AddListing] - Error sharing - ', error);
    });
  }

  navigateToNewListing(listing) {
    this.props.navigator.replace({
      hasActions: true,
      navigator: this.props.navigator,
      component: ListingDetail,
      title: listing.name,
      passProps: { listing }
    });
  }

  _onListingError(title: string, errorMessage: string) {
    this.setState({ loading: false });
    AlertIOS.alert(title, errorMessage);
  }


  _formPressed() {
    var valid = this.refs.form.getValue();
    if (valid) {
      var listing = JSON.parse(JSON.stringify(valid)); // Surely this is insane.
      listing = Object.assign(listing, this.state.location);
      // listing.images = this.state.images;
      // this.setState({ loading: true });

      listing.id = 'abc123';
      listing.images = ['http://media.lessthan3.com/wp-content/uploads/2014/09/aphexSyro.jpg'];

      this.shareOnFacebook(listing);

      // CreateListing.create(listing)
      //   .then(this._onListingCreated.bind(this))
      //   .catch((error) => {
      //     console.warn('[CreateListing] - Error creating listing', error); 
      //     this._onListingError('Sorry! There was an error creating your listing.',  'Please let us know what happened.')
      //   });
    } else {
      var error = this.refs.form.validate();
      console.warn('[AddListing] - Error with form: ', error);
      this._onListingError('Uh oh!', 'Sorry, there were errors with your listing!');
    }
  }

  _addImagePressed() {
    var options = {
      title: 'Select Image', // specify null or empty string to remove the title
      cancelButtonTitle: 'Cancel',
      takePhotoButtonTitle: 'Take Photo...', // specify null or empty string to remove this button
      chooseFromLibraryButtonTitle: 'Choose from Library...', // specify null or empty string to remove this button
      quality: 0.5,
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
  
  _onLocationSelected(place, details) {
    if (!details.address_components) { return false; }

    var address = details.address_components;
    var latlng = details.geometry.location;

    var location = {
      location: `${latlng.lat}, ${latlng.lng}`,
      address_line_1: `${address[0].long_name} ${address[1].long_name}`,
      locality: address[2].long_name,
      administrative_area_level_1: address[3].long_name,
      country: address[4].long_name,
      postcode: address[5].long_name
    };

    console.log(location);

    this.setState({ location });
  }

  addressForm() {
    if (this.state.isOnlineStore) {
      return false;
    }

    return (
      <View>
        <Text style={t.form.Form.stylesheet.controlLabel.normal}>Address</Text>
        <GooglePlacesAutocomplete 
          placeholder='Start typing an address'
          fetchDetails
          onPress={this._onLocationSelected.bind(this)}
          query={{
            key: API_KEY,
            language: 'en',
            types: 'geocode'
          }}
          styles = {{ textInput: t.form.Form.stylesheet.textbox.normal }}
        />
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
        <LoadingScreen isVisible={this.state.loading} />

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
    margin: 32,
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
  },
  background: {
    flex: 1,
    justifyContent: 'center',
  }
});


module.exports = AddListing;
