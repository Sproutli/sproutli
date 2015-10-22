'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
  Image,
  View,
  ListView,
  TouchableHighlight,
  LinkingIOS,
  ActivityIndicatorIOS,
  ScrollView,
  MapView
} = React;

var Carousel = require('react-native-looped-carousel');
var Communications = require('react-native-communications');
var Icon = require('react-native-vector-icons/Ionicons');
var Dimensions = require('Dimensions');
var {width} = Dimensions.get('window');

var Reviews = require('../Utils/Reviews');
var Review = require('./Review');
var ReviewModal = require('./ReviewModal');
var BuyKindnessCardModal = require('./BuyKindnessCardModal');
var KindnessCards = require('../Utils/KindnessCards');
var OfferModal = require('./OfferModal');
var Button = require('./Button');

var COLOURS = require('../Constants/Colours');
var VEGAN_LEVELS = require('../Constants/VeganLevels');

class ListingDetail extends React.Component {
  constructor() {
    super();

    this.state = {
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
      currentTab: 0,
      reviews: [],
      showMap: false
    };
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

  renderedReviews() {
    if (this.state.loadingReviews) {
      return (
        <View style={styles.loadingIndicator}>
          <ActivityIndicatorIOS size='large' />
        </View>
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
      <TouchableHighlight style={styles.actionBarButton} onPress={this._onShowMap.bind(this)}>
        <View style={styles.actionBarButton}>
          <Icon name='map' size={40} color='white' />
          <Text style={{color: 'white', textAlign: 'center'}}>Map</Text>
        </View>
      </TouchableHighlight>
    );
  }

  renderedWebsiteButton() {
    if (!this.props.listing.website) return <View />;

    return (
      <TouchableHighlight style={styles.actionBarButton} onPress={this._onGoToWebsite.bind(this)}>
        <View style={styles.actionBarButton}>
          <Icon name='earth' size={40} color='white' />
          <Text style={{color: 'white', textAlign: 'center'}}>Website</Text>
        </View>
      </TouchableHighlight>
    );
  }

  renderedCallButton() {
    if (!this.props.listing.phone_number) return <View />;

    return (
      <TouchableHighlight style={styles.actionBarButton} onPress={this._onCallListing.bind(this)}>
        <View style={styles.actionBarButton}>
          <Icon name='ios-telephone' size={40} color='white' />
          <Text style={{color: 'white', textAlign: 'center'}}>Call</Text>
        </View>
      </TouchableHighlight>
    );
  }

  renderedActionBar() {
    return (
      <View style={styles.actionBar}> 
        <TouchableHighlight style={styles.actionBarButton} onPress={this._onShowImages.bind(this)}>
          <View style={styles.actionBarButton}>
            <Icon name='images' size={40} color='white' />
            <Text style={{color: 'white', textAlign: 'center'}}>Images</Text>
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

        {this.renderedActionBar()}

        <View style={styles.container}>
          <View style={styles.buttonsContainer}>
            <TouchableHighlight style={[styles.leftButton, {backgroundColor: this.state.currentTab === 0 ? COLOURS.GREY : '#fff'}]} onPress={() => this.setState({currentTab: 0})} >
              <Text style={[styles.buttonText, {color: this.state.currentTab === 0 ? '#fff' : '#222'}]}>Details</Text>
            </TouchableHighlight>
            <TouchableHighlight style={[styles.rightButton, {backgroundColor: this.state.currentTab === 1 ? COLOURS.GREY : '#fff'}]} onPress={() => this.setState({currentTab: 1})} >
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
    fontSize: 17,
    paddingTop: 15,
    paddingBottom: 15
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
    borderBottomLeftRadius: 5,
    padding: 6
  },
  rightButton: {
    flex: 1,
    borderColor: COLOURS.GREY,
    borderWidth: 2,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    padding: 6
  },
  buttonText: {
    textAlign: 'center'
  },
  actionBarButton: {
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
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
