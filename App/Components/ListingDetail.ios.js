'use strict';

import {
  StyleSheet,
  Text,
  Image,
  View,
  ListView,
  TouchableHighlight,
  LinkingIOS,
  ActivityIndicatorIOS,
  ScrollView,
  PixelRatio,
  NativeModules,
  MapView,
} from 'react-native';
import React from 'react';

var Carousel = require('react-native-looped-carousel');
var Communications = require('react-native-communications');
var Icon = require('react-native-vector-icons/Ionicons');
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

class ListingDetail extends React.Component {
  constructor(props) {
    super();

    this.state = {
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
      currentTab: 0,
      reviews: [],
      showMap: false
    };

    let { name, id, categories } = props.listing;

    Intercom.logEvent('viewed_listing', { listingID: id, listingName: name });
    GoogleAnalytics.viewedScreen('View Listing Detail');
    GoogleAnalytics.trackEvent('Listing', 'View', id);
    AnswersReporter.reportViewListing(id, name, categories[0]);
  }

  componentDidMount() {
    this.getReviews();
  }

  getReviews() {
    var listingID = this.props.listing.id;
    this.setState({ loadingReviews: true });

    Reviews.getReviewsForListing(listingID)
      .then((reviews) => {
        reviews = reviews.sort((a, b) => a.created - b.created);

        this.setState({ 
          dataSource: this.state.dataSource.cloneWithRows(reviews),
          loadingReviews: false
        });
      })
      .catch((error) => console.warn(error)); 
  }

  renderedImages() {
    if (this.state.showMap) {
      var location = this.props.listing.location.split(',').map((n) => Number(n)),
        region = {latitude: location[0], longitude: location[1], latitudeDelta: 0.05, longitudeDelta: 0.05},
        annotations = [{latitude: location[0], longitude: location[1], title: this.props.listing.name, animateDrop: true}];
      
      return (
        <MapView 
          region={region}
          annotations={annotations}
          style={styles.imageStyle} />
      );
    }
    let images = this.props.listing.images;
    if (!images || images.length == 0) {
      return <Text>Sorry! No images for {this.props.listing.name}</Text>; 
    }

    if (images.length == 1) {
      return <Image style={styles.imageStyle} source={{uri: images[0] }} />;
    }

    return (
      <Carousel autoplay={false} style={styles.imageStyle}>
        {images.map((image, index) => <Image key={index} style={styles.imageStyle} source={{uri: image }} />)} 
      </Carousel>
    );
  }

  renderedDetails() {
    return (
      <View>
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

  renderedReviews() {
    GoogleAnalytics.viewedScreen('Reviews');
    if (this.state.loadingReviews) {
      return (
        <LoadingScreen>Fetching reviews..</LoadingScreen>
      );
    }
    return (
      <View>
        <View style={styles.buttonContainer}>
          <Button onPress={this._onLeaveReview.bind(this)}>Leave a Review</Button>
        </View>

        <ListView
          renderRow={(review, index) => <Review style={styles.text} key={index} {...review} />}
          dataSource={this.state.dataSource}
        />
      </View>
    );
  }

  renderedMapButton() {
    if (!this.props.listing.location) return <View />;

    return (
      <TouchableHighlight style={styles.actionBarButton} onPress={this._onShowMap.bind(this)} underlayColor={COLOURS.LIGHTER_GREY}>
        <View style={styles.actionBarButton}>
          <Icon name='map' size={13 * pixelRatio} color='white' />
          <Text style={styles.actionBarText}>Map</Text>
        </View>
      </TouchableHighlight>
    );
  }

  renderedWebsiteButton() {
    if (!this.props.listing.website) return <View />;

    return (
      <TouchableHighlight style={styles.actionBarButton} onPress={this._onGoToWebsite.bind(this)} underlayColor={COLOURS.LIGHTER_GREY}>
        <View style={styles.actionBarButton}>
          <Icon name='earth' size={13 * pixelRatio} color='white' />
          <Text style={styles.actionBarText}>Website</Text>
        </View>
      </TouchableHighlight>
    );
  }

  renderedCallButton() {
    if (!this.props.listing.phone_number) return <View />;

    return (
      <TouchableHighlight style={styles.actionBarButton} onPress={this._onCallListing.bind(this)} underlayColor={COLOURS.LIGHTER_GREY}>
        <View style={styles.actionBarButton}>
          <Icon name='ios-telephone' size={13 * pixelRatio} color='white' />
          <Text style={styles.actionBarText}>Call</Text>
        </View>
      </TouchableHighlight>
    );
  }

  renderedActionBar() {
    return (
      <View style={styles.actionBar}> 
        <TouchableHighlight underlayColor={COLOURS.LIGHTER_GREY} style={styles.actionBarButton} onPress={this._onShowImages.bind(this)}>
          <View style={styles.actionBarButton}>
            <Icon name='images' size={13 * pixelRatio} color='white' />
            <Text style={styles.actionBarText}>Images</Text>
          </View>
        </TouchableHighlight>
        { this.renderedMapButton() }
        { this.renderedCallButton() }
        { this.renderedWebsiteButton() }
      </View>
    );
  }

  _onCallListing() {
    Communications.phonecall(this.props.listing.phone_number, true);
  }

  _onShowMap() {
    this.setState({ showMap: true });
  }

  _onShowImages() {
    this.setState({ showMap: false });
  }

  _onGoToWebsite() {
    var url = this.props.listing.website;
    if (!url.match('http:\/\/')) {
      url = 'http://' + url;
    }
    LinkingIOS.openURL(url);
  }

  _onLeaveReview() {
    this.props.navigator.push({
      title: 'Leave a Review',
      component: ReviewModal,
      passProps: { listingID: this.props.listing.id, name: this.props.listing.name, getReviews: this.getReviews.bind(this) }
    });
  }

  render() {
    return(
      <ScrollView style={styles.outerContainer}>
        {this.renderedImages()}

        {this.renderedActionBar()}

        <View style={styles.container}>
          <View style={styles.buttonsContainer}>
            <TouchableHighlight underlayColor={COLOURS.LIGHT_GREY} style={[styles.leftButton, {backgroundColor: this.state.currentTab === 0 ? COLOURS.GREY : '#fff'}]} onPress={() => this.setState({currentTab: 0})} >
              <Text style={[styles.buttonText, {color: this.state.currentTab === 0 ? '#fff' : '#222'}]}>Details</Text>
            </TouchableHighlight>
            <TouchableHighlight underlayColor={COLOURS.LIGHT_GREY} style={[styles.rightButton, {backgroundColor: this.state.currentTab === 1 ? COLOURS.GREY : '#fff'}]} onPress={() => this.setState({currentTab: 1})} >
              <Text style={[styles.buttonText, {color: this.state.currentTab === 1 ? '#fff' : '#222'}]}>Reviews</Text>
            </TouchableHighlight>
          </View>

          { this.state.currentTab === 0 ? this.renderedDetails() : this.renderedReviews() }
        </View>

      </ScrollView>
    );
  }
}

var styles = StyleSheet.create({
  description: {
    color: COLOURS.GREY,
    fontSize: pixelRatio === 3 ? 18 : 15,
    paddingTop: 15,
    paddingBottom: 30
  },

  text: {
    color: COLOURS.GREY,
    paddingBottom: 15
  },

  actionBar: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 64,
    backgroundColor: COLOURS.GREY,
    flexDirection: 'row'
  },
  outerContainer: {
    flex: 1,
    paddingTop: 0,
    bottom: 16
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
  buttonText: {
    margin: 6,
    textAlign: 'center'
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
    alignItems: 'center'
  }
});


ListingDetail.propTypes = {
  listing: React.PropTypes.object.isRequired,
  navigator: React.PropTypes.object.isRequired
};

module.exports = ListingDetail;
