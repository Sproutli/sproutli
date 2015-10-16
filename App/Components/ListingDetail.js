'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
  Image,
  View,
  ListView,
  TouchableHighlight,
  ScrollView
} = React;

var Carousel = require('react-native-looped-carousel');
var Dimensions = require('Dimensions');
var {width} = Dimensions.get('window');
var Reviews = require('../Utils/Reviews');
var Review = require('./Review');

class ListingDetail extends React.Component {
  constructor(props) {
    super();

    this.state = {
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
      currentTab: 1,
      reviews: []
    };

    this.getReviews(props.listing.id);
  }

  getReviews(listingID) {
    Reviews.getReviewsForListing(listingID)
      .then((reviews) => {
        this.setState({ dataSource: this.state.dataSource.cloneWithRows(reviews) });
      })
      .catch((error) => console.warn(error)); 
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
        <Text style={{fontSize: 16}}>{this.props.listing.description}</Text>
        <Text />
        <Text />
        <Text style={styles.bold}>Categories</Text>
        <Text>{this.props.listing.categories.join(', ')}</Text>
        <Text />
        <Text style={styles.bold}>Tags</Text>
        <Text style={styles.tags}>
          {this.props.listing.tags.map((tag) => '#' + tag.toLowerCase() + ' ')}
        </Text>
        <Text />
        <Text style={styles.bold}>Vegan Level</Text>
        <Text>{this.props.listing.vegan_level}</Text>
        <Text />
        <Text style={styles.bold}>Rating</Text>
        <Text>{this.props.listing.rating}</Text>
      </View>
    );
  }


  renderedReviews() {
    return (
      <View>
        <TouchableHighlight onPress={this._onLeaveReview.bind(this)}>
          <Text style={{textAlign: 'center'}}>Leave a Review</Text>
        </TouchableHighlight>
        <ListView
          renderRow={(review, index) => <Review key={index} {...review} />}
          dataSource={this.state.dataSource}
        />
      </View>
    );
  }

  _onLeaveReview() {
  }

  render() {
    return(
      <ScrollView style={styles.outerContainer}>
        {this.renderedImages()}

        <View style={styles.actionBar}> 
          <Text style={{color: 'white', flex: 1, textAlign: 'center'}}>Call</Text>
          <Text style={{color: 'white', flex: 1, textAlign: 'center'}}>Map</Text>
          <Text style={{color: 'white', flex: 1, textAlign: 'center'}}>Cry</Text>
        </View>

        <View style={styles.container}>
          <View style={styles.buttonsContainer}>
            <TouchableHighlight style={styles.leftButton} onPress={() => this.setState({currentTab: 0})} >
              <Text>Details</Text>
            </TouchableHighlight>
            <TouchableHighlight style={styles.rightButton} onPress={() => this.setState({currentTab: 1})} >
              <Text>Reviews</Text>
            </TouchableHighlight>
          </View>

          { this.state.currentTab === 0 ? this.renderedDetails() : this.renderedReviews() }
        </View>

      </ScrollView>
    );
  }
}

ListingDetail.propTypes = {
  listing: React.PropTypes.object.isRequired
};

var styles = StyleSheet.create({
  actionBar: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 64,
    backgroundColor: '#222',
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
    color: '#222',
    fontWeight: 'bold'
  },
  tags: {
    color: '#222',
    fontStyle: 'italic'
  },
  description: {
    fontSize: 15
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    width
  },
  leftButton: {
    borderWidth: 2,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    padding: 6
  },
  rightButton: {
    borderWidth: 2,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    padding: 6
  }
});


module.exports = ListingDetail;
