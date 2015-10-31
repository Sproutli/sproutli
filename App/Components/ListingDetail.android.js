'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
  Image,
  View,
  ListView,
  TouchableHighlight,
  ProgressBarAndroid,
  ScrollView,
  PixelRatio
} = React;
var WebIntent = require('react-native-webintent');
var CallIntent = require('react-native-callintent');
var MapIntent = require('react-native-mapintent');

var Carousel = require('react-native-looped-carousel');
var Icon = require('react-native-vector-icons/Ionicons');
var Dimensions = require('Dimensions');
var {width} = Dimensions.get('window');
var pixelRatio = PixelRatio.get();

var Intercom = require('../Utils/Intercom');
var GoogleAnalytics = require('../Utils/GoogleAnalytics');
var Reviews = require('../Utils/Reviews');
var KindnessCards = require('../Utils/KindnessCards');

var Review = require('./Review');
var ReviewModal = require('./ReviewModal');
var BuyKindnessCardModal = require('./BuyKindnessCardModal');
var OfferModal = require('./OfferModal');
var Button = require('./Button');

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
        <View style={styles.loadingIndicator}>
          <ProgressBarAndroid styleAttr='Large' />
        </View>
      );
    }

    if (this.state.reviews.length < 1) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.description}>No reviews for {this.props.listingName} yet.</Text>
          <View style={styles.buttonContainer}>
            <Button onPress={this._onLeaveReview.bind(this)}>Leave the first review</Button>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.container}>
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
}

class ListingDetail extends React.Component {
  constructor(props) {
    super(props);

    Intercom.logEvent('viewed_listing', { listingID: props.listing.id, listingName: props.listing.name });
    GoogleAnalytics.viewedScreen('View Listing Detail');
    GoogleAnalytics.trackEvent('Listing', 'View', props.listing.id);

  }

  componentDidMount() {
    var actions = [
      { 
        title: 'Reviews', func: () => {
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
      <Carousel autoplay={false} style={styles.imageStyle}>
        {images.map((image, index) => <Image key={index} style={styles.imageStyle} source={{uri: image }} />)} 
      </Carousel>
    );
  }

  renderedDetails() {
    return (
      <View>
        { this.renderedOffer() }

        <Text style={styles.description}>{this.props.listing.description}</Text>

        <Text style={styles.bold}>Categories</Text>
        <Text style={styles.text}>{this.props.listing.categories.join(', ')}</Text>

        <Text style={styles.bold}>Tags</Text>
        <Text style={styles.tags}>
          {this.props.listing.tags.map((tag) => '#' + tag.toLowerCase() + ' ')}
        </Text>

        <Text style={styles.bold}>Vegan Level</Text>
        <Text style={styles.text}>{VEGAN_LEVELS[this.props.listing.vegan_level].long}</Text>

        <Text style={styles.bold}>Rating</Text>
        <Text style={styles.text}>{this.props.listing.rating ? `${this.props.listing.rating}/5.0` : 'No rating yet' }</Text>
      </View>
    );
  }

  renderedOffer() {
    if (!this.props.listing.offer_details) { return <View />; }

    return(
      <View style={styles.buttonContainer}>
        <Button onPress={this._onViewOffer.bind(this)}>View Kindness Card offer</Button>
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
    CallIntent.open(this.props.listing.phone_number);
  }

  _onShowMap() {
    var location = this.props.listing.location.split(',');
    MapIntent.open(location[0], location[1], this.props.listing.name);
  }

  _onShowImages() {
    this.setState({ showMap: false });
  }

  _onGoToWebsite() {
    var url = this.props.listing.website;
    if (!url.match('http:\/\/')) {
      url = 'http://' + url;
    }

    WebIntent.open(url);
  }

  _onViewOffer() {
    var askToBuy = () => {
      this.props.navigator.push({
        title: 'Get a Kindness Card',
        component: BuyKindnessCardModal,
        passProps: { listingName: this.props.listing }
      });
    };
    KindnessCards.fetchCard()
      .then((card) => {
        if (card.length < 1) { 
          askToBuy();
          return;
        }

        this.props.navigator.push({
          title: 'View Offer',
          component: OfferModal,
          passProps: { 
            offerDetails: this.props.listing.offer_details, 
            offerConditions: this.props.listing.offer_conditions, 
            offerInstructions: this.props.listing.offer_instructions 
          }
        });
      })
      .catch(askToBuy);
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
    fontSize: pixelRatio === 3 ? 18 : 15,
    paddingTop: 15,
    paddingBottom: 30
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
