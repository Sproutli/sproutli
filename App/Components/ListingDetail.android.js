'use strict';

import React from 'react';
import {
  StyleSheet,
  Text,
  Image,
  View,
  ListView,
  ProgressBarAndroid,
  ScrollView,
  NativeModules,
  ViewPagerAndroid,
  IntentAndroid,
  PixelRatio
} from 'react-native';

var Dimensions = require('Dimensions');
var {width} = Dimensions.get('window');
var pixelRatio = PixelRatio.get();

var Intercom = require('../Utils/Intercom');
var GoogleAnalytics = require('../Utils/GoogleAnalytics');
var Reviews = require('../Utils/Reviews');
var AnswersReporter = NativeModules.AnswersReporter;

var Review = require('./Review');
var ReviewModal = require('./ReviewModal');
var Button = require('./Button');
var LoadingScreen = require('./LoadingScreen');

var COLOURS = require('../Constants/Colours');
var VEGAN_LEVELS = require('../Constants/VeganLevels');

class ReviewsComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
      reviews: [],
      loadingReviews: true
    };
  }

  componentDidMount() {
    GoogleAnalytics.viewedScreen('Reviews');
    this.getReviews();
  }

  _onLeaveReview() {
    this.props.navigator.push({
      title: 'Leave a Review',
      component: ReviewModal,
      passProps: { listingID: this.props.listingID, name: this.props.listingName, getReviews: this.getReviews.bind(this) }
    });
  }

  getReviews() {
    var listingID = this.props.listingID;

    Reviews.getReviewsForListing(listingID)
      .then((reviews) => {
        reviews = reviews.sort((a, b) => a.created - b.created);

        this.setState({ 
          reviews,
          dataSource: this.state.dataSource.cloneWithRows(reviews),
          loadingReviews: false
        });
      })
      .catch((error) => console.warn(error)); 
  }

  render() {
    if (this.state.loadingReviews) {
      return (
        <LoadingScreen>Fetching reviews..</LoadingScreen>
      );
    }

    if (this.state.reviews.length < 1) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.description}>No reviews for {this.props.listingName} yet!</Text>
          <View style={styles.buttonContainer}>
            <Button onPress={this._onLeaveReview.bind(this)}>Leave the first review</Button>
          </View>
        </View>
      );
    }

    return (
      <ScrollView style={styles.container}>
        <View style={styles.buttonContainer}>
          <Button onPress={this._onLeaveReview.bind(this)}>Leave a Review</Button>
        </View>

        <ListView
          renderRow={(review, index) => <Review style={styles.text} key={index} {...review} />}
          dataSource={this.state.dataSource}
        />
      </ScrollView>
    );
  }
}

class ListingDetail extends React.Component {
  constructor(props) {
    super(props);

    let { name, id, categories } = props.listing;

    Intercom.logEvent('viewed_listing', { listingID: id, listingName: name });
    GoogleAnalytics.viewedScreen('View Listing Detail');
    GoogleAnalytics.trackEvent('Listing', 'View', id);
    AnswersReporter.reportViewListing(id, name, categories[0]);
  }

  componentDidMount() {
    var actions = [
      { 
        title: 'Reviews', 
        icon: require('../Images/ic_star_white.png'),
        show: 'always',
        func: () => {
          this.props.navigator.push({
            title: `Reviews for ${this.props.listing.name}`,
            component: ReviewsComponent,
            passProps: { listingID: this.props.listing.id, listingName: this.props.listing.name }
          });
        }
      }
    ];

    if (this.props.listing.location) {
      actions.push({title: 'Map', func: this._onShowMap.bind(this)});
    }

    if (this.props.listing.phone_number) {
      actions.push({title: 'Call', func: this._onCallListing.bind(this)});
    }

    if (this.props.listing.website) {
      actions.push({title: 'Website', func: this._onGoToWebsite.bind(this)});
    }

    this.props.navigator.setActions(actions);
  }


  renderedImages() {
    let images = this.props.listing.images;
    if (!images || images.length == 0) {
      return <Text>Sorry! No images for {this.props.listing.name}</Text>; 
    }

    if (images.length == 1) {
      return <Image style={styles.imageStyle} source={{uri: images[0] }} />;
    }

    return (
      <ViewPagerAndroid style={styles.imageStyle}>
        {images.map((image, index) => <View><Image key={index} style={styles.imageStyle} source={{uri: image }} /></View>)} 
      </ViewPagerAndroid>
    );
  }

  renderedDetails() {
    return (
      <View style={styles.container}>
        <Text style={styles.description}>{this.props.listing.description}</Text>

        <Text style={styles.bold}>Categories</Text>
        <Text style={styles.text}>{this.props.listing.categories.join(', ')}</Text>

        <Text style={styles.bold}>Tags</Text>
        <Text style={styles.tags}>
          {(this.props.listing.tags || []).map((tag) => '#' + tag.toLowerCase() + ' ')}
        </Text>

        <Text style={styles.bold}>Vegan Level</Text>
        <Text style={styles.text}>{VEGAN_LEVELS[this.props.listing.vegan_level].long}</Text>

        <Text style={styles.bold}>Rating</Text>
        <Text style={styles.text}>{this.props.listing.rating ? `${this.props.listing.rating}/5.0` : 'No rating yet' }</Text>

        <Text style={styles.bold}>Location</Text>
        <Text style={[styles.text, {paddingBottom: 0}]}>{this.props.listing.address_line_1}</Text>
        <Text style={[styles.text, {paddingBottom: 0}]}>{this.props.listing.locality}</Text>
        <Text style={[styles.text, {paddingBottom: 0}]}>{this.props.listing.administrative_area_level_1}</Text>
        <Text style={[styles.text, {paddingBottom: 0}]}>{this.props.listing.postcode}</Text>
      </View>
    );
  }

  _onCallListing() {
    IntentAndroid.openURL(`tel://${this.props.listing.phone_number}`);
  }

  _onShowMap() {
    const locationURL = encodeURI(`geo:0:0?q=${this.props.listing.location}(${this.props.listing.name})`);
    IntentAndroid.openURL(locationURL);
  }

  _onShowImages() {
    this.setState({ showMap: false });
  }

  _onGoToWebsite() {
    var url = this.props.listing.website;
    if (!url.match('http:\/\/')) {
      url = 'http://' + url;
    }

    IntentAndroid.openURL(url);
  }


  render() {
    return(
      <ScrollView style={styles.outerContainer}>
        {this.renderedImages()}

        { this.renderedDetails() }
      </ScrollView>
    );
  }
}

var styles = StyleSheet.create({
  description: {
    color: COLOURS.GREY,
    fontSize: pixelRatio === 3 ? 15 : 12,
    paddingTop: 15,
    paddingBottom: 15
  },

  text: {
    color: COLOURS.GREY,
    paddingBottom: 15
  },

  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },

  outerContainer: {
    flex: 1,
    paddingTop: 0
  },
  container: {
    padding: 10,
    paddingTop: 20
  },
  imageStyle: {
    width: width,
    height: width
  },
  bold: {
    color: COLOURS.GREY,
    fontWeight: 'bold'
  },
  tags: {
    color: COLOURS.GREY,
    fontStyle: 'italic',
    paddingBottom: 15
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20
  },
  leftButton: {
    flex: 1,
    borderColor: COLOURS.GREY,
    borderWidth: 2,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5
  },
  rightButton: {
    flex: 1,
    borderColor: COLOURS.GREY,
    borderWidth: 2,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5
  },
  actionBarButton: {
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  actionBarText: {
    color: 'white',
    fontSize: pixelRatio === 2 ? 12 : 15
  },
  loadingIndicator: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonContainer: {
    alignItems: 'center',
    paddingBottom: 10
  }
});


ReviewsComponent.propTypes = {
  listingID: React.PropTypes.string.isRequired,
  listingName: React.PropTypes.string.isRequired,
  navigator: React.PropTypes.object.isRequired
};

ListingDetail.propTypes = {
  listing: React.PropTypes.object.isRequired,
  navigator: React.PropTypes.object.isRequired
};

module.exports = ListingDetail;
