/* @flow */
'use strict';

var React = require('react-native');
const {
  Image,
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  ActionSheetIOS,
  Alert,
  Platform,
  NativeModules: {
    ImagePickerManager,
    CrashlyticsReporter
  },
} = React;

// Dimensions
var Dimensions = require('Dimensions');
var { width } = Dimensions.get('window');
var imageSize = width / 3 - 16;


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
var GoogleAnalytics = require('../Utils/GoogleAnalytics');

// Components
var Button = require('./Button');
var ListingDetail = require('./ListingDetail');
var LoadingScreen = require('./LoadingScreen');

// Utils
var CreateListing = require('../Utils/CreateListing');
var Facebook;
if (Platform.os === 'ios') {
  Facebook = require('../Utils/Facebook');
}
var Slack = require('../Utils/Slack');
var Users = require('../Utils/Users');
import AddressParser from '../Utils/AddressParser';

// Constants
var CATEGORIES = [
  'Cafes & Restaurants',
  'Clothing, Shoes & Accessories',
  'Food Stores',
  'Hair & Beauty',
  'Professional Services & Trades',
];
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
var OwnerIs = t.enums({
  'not_sure': 'Not Sure',
  'vegetarian': 'Vegetarian',
  'vegan': 'Vegan',
});
var PhoneNumber = t.refinement(t.String, (s) => {
  return s.startsWith('+61');
});

var defaults = {
  name: '',
  online_store: 'N',
  categories: [],
  description: '',
  vegan_level: '',
  tags: null,
  owner_is: 'not_sure'
};


var Listing = t.struct({
  name: t.String,
  description: t.String,
  tags: t.Array,
  phone_number: t.maybe(PhoneNumber),
  website: t.maybe(t.String),
  vegan_level: VeganLevel,
  categories: Category,
  online_store: OnlineStore,
  owner_is: OwnerIs,
});

t.form.Form.stylesheet.controlLabel.normal.color = COLOURS.GREY;
t.form.Form.stylesheet.textbox.normal.color = COLOURS.GREY;

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
      return value;
    }
  },

  parse: (value) => {
    if (typeof value === 'string') { 
      return value.trim().replace(/#/g, '').split(' ');
    } else {
      return value;
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
      placeholder: 'eg. +61 3 9898 0000',
      keyboardType: 'phone-pad',
      error: (value) => value ? '' : 'Phone numbers must start with +61'
    },
    website: {
      keyboardType: 'url',
      autoCorrect: false,
      autoCapitalize: 'none'
    },
    tags: {
      keyboardType: 'twitter',
      transformer: tagsTransformer,
      placeholder: 'eg. #cake #dessert',
      autoCapitalize: 'none',
    },
    vegan_level: {
      transformer: veganLevelTransformer
    },
    online_store: {
      label: 'Business Type',
      nullOption: false
    },
    categories: {
      transformer: arrayTransformer
    },
    owner_is: {
      nullOption: false
    }
  }
};

class AddListing extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      loadingText: '',
      location: {},
      images: [],
      isOnlineStore: false,
      addressIsIncorrect: false,
      formValue: defaults
    };
    
    GoogleAnalytics.viewedScreen('Add Listing');
  }

  _onFormChanged(raw) {
    var isOnlineStore = raw.online_store === 'y';

    this.setState({
      formValue: raw,
      isOnlineStore
    });
  }

  _onListingCreated(listing) {
    console.log(`[AddListing] - Created listing with id ${listing.id}`);
    this.setState({ 
      loading: false,
      listing
    });

    const ALERT_TITLE = 'Listing Added';
    const ALERT_MESSAGE = `Thanks for adding ${this.state.formValue.name}!`;
    const ALERT_OPTIONS = [{ text: 'OK', onPress: this.navigateToNewListing.bind(this, listing) }];

    Alert.alert(ALERT_TITLE, ALERT_MESSAGE, ALERT_OPTIONS);
  }

  shareOnFacebook(listing) {
    Facebook.shareListing(listing, (this.state.images[0] || {}).uri)
    .then(() => {
      this.setState({ loading: false });
      Alert.alert(
        'Sharing Complete',
        `Thanks for sharing ${listing.name}!`,
        [{ text: 'OK', onPress: this.navigateToNewListing.bind(this, listing) }]
      );
    })
    .catch((error) => {
      Alert.alert('Error sharing listing', 'Sorry, there was an error talking to Facebook!');
      console.warn('[AddListing] - Error sharing - ', error);
      this.reportError(error);
    });
  }

  reportError(error) {
    Users.fetchUser()
   .then((user) => {
      console.log('Reporting error to crashlytics:', error);
      var message = `@kane.rogers - ${user.name} (${user.email}) encountered an error creating a listing. Error code: \`${error.code}\` Error message: \`${error.message}\``;
      CrashlyticsReporter.reportError(error.message);
      Slack.postMessage(message);
    })
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
    Alert.alert(title, errorMessage);
  }

  createListing(listing) {
    debugger;
    listing = Object.assign(listing, this.state.location);
    listing.images = this.state.images.slice(0);

    CreateListing.create(listing)
      .then(this._onListingCreated.bind(this))
      .catch((error) => {
        console.warn('[CreateListing] - Error creating listing', error); 
        this.reportError(error);
        this._onListingError('Sorry! There was an error creating your listing.',  'Please let us know what happened.')
      });
  }

  hasCorrectAddress() {
    if (this.state.isOnlineStore) { return true; }  // If this is an online listing, we don't care about the address.

    // If we have a location, our address is correct.
    if (this.state.location.locality) { 
      this.setState({ addressIsIncorrect: false });
      return true; 
    }

    // This is a phyiscal, but we have no location - the address is incorrect.
    this.setState({ addressIsIncorrect: true });
    return false;
  }

  _formPressed() {
    const formValue = this.refs.form.getValue();
    var listingIsValid = formValue && this.hasCorrectAddress();
    if (listingIsValid) {
      this.setState({ loading: true, loadingText: 'Creating your listing..' });

      var listing = JSON.parse(JSON.stringify(formValue)); // Surely this is insane.
      this.createListing(listing);
    } else {
      var error = this.refs.form.validate();
      this.hasCorrectAddress();
      console.warn('[AddListing] - Error with form: ', error, this.state.location);
      this._onListingError('Could not create listing', 'Sorry, there was an error with your listing. Scroll up and look for areas marked in red.');
    }
  }

  _addImagePressed() {
    var options = {
      title: 'Select Image',
      cancelButtonTitle: 'Cancel',
      takePhotoButtonTitle: 'Take Photo',
      chooseFromLibraryButtonTitle: 'Choose from Library',
      quality: 0.5,
      hasData: false,
      storageOptions: {
        skipBackup: true,
      }
    };

    console.log('ImagePicker:', ImagePickerManager);

    ImagePickerManager.showImagePicker(options, (response) => {
      if (response.didCancel) { return ; }
      var source;

      console.log('***RESPONSE FROM IMAGEPICKER', response);
      if (Platform.OS === 'ios') {
        source = {uri: response.uri.replace('file://', ''), isStatic: false};
      } else {
        source = {uri: `file://${response.path}`, isStatic: true};
      };

      var images = this.state.images;
      images.push(source);

      this.setState({ images });
    });
  }

  _imagePressed(imageIndex) {
    // TODO: Support Android.
    if (Platform.OS === 'android') {
      return;
    }

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

    const location = AddressParser.parse(address, latlng);

    this.setState({ location });
  }

  addressForm() {
    if (this.state.isOnlineStore) {
      return false;
    }

    const stylesheet = t.form.Form.stylesheet;
    const labelStyle = this.state.addressIsIncorrect ? stylesheet.controlLabel.error : stylesheet.controlLabel.normal;
    const textInputStyle = this.state.addressIsIncorrect ? stylesheet.textbox.error : stylesheet.textbox.normal;

    var currentLocation = this.state.location;
    const currentLocationString = currentLocation.address_line_1 ? `${currentLocation.address_line_1}, ${currentLocation.locality}` : currentLocation.locality;
    var that = this;
    var API_KEY = 'AIzaSyAgb2XoUPeXZP3jKAqhaWX-D5rfkyIIi7E';
    var GooglePlacesAutocomplete = require('react-native-google-places-autocomplete').create({
      placeholder: 'Start typing an address or location',
      fetchDetails: true,
      styles: { textInput: textInputStyle },
      getDefaultValue: () => currentLocationString,
      onPress(place, placeDetails) {
        if (place === null) { 
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

        that._onLocationSelected(location, placeDetails);
      },
      minLength: 2,
      query: {
        key: API_KEY,
        language: 'en',
        types: 'geocode'
      }
    });


    return (
      <View style={{marginBottom: 5}}>
        <Text style={labelStyle}>Location</Text>
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
    var { loading } = this.state;
    if (loading) {
      return <LoadingScreen>{this.state.loadingText}</LoadingScreen>
    }

    return (
      <ScrollView style={styles.container} keyboardDismissMode='on-drag'>
        <View style={styles.images}>
          { this.state.images.map((i, k) => this.renderImage(i, k)) }
          { this.imagePicker() }
        </View>

        { this.addressForm() }

        <Form
          onChange={this._onFormChanged.bind(this)}
          value={this.state.formValue}
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
