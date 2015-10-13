'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
  Image,
  View,
  ScrollView
} = React;

var Carousel = require('react-native-looped-carousel');
var Dimensions = require('Dimensions');
var {width} = Dimensions.get('window');

class ListingDetail extends React.Component {
  renderedImages() {
    let images = this.props.listing.images;
    if (!images || images.length == 0) {
      return <Text>Sorry! No images for {this.props.listing.name}</Text> 
    }

    if (images.length == 1) {
      return <Image style={styles.imageStyle} source={{uri: images[0] }} />
    }

    return (
      <Carousel autoplay={false} style={styles.imageStyle}>
        {images.map((image, index) => <Image key={index} style={styles.imageStyle} source={{uri: image }} />)} 
      </Carousel>
    );
  }

  render() {
    return(
      <ScrollView style={styles.outerContainer}>
        {this.renderedImages()}
        <View style={styles.actionBar}> 
          <Text style={{color: "white", flex: 1, textAlign: 'center'}}>Call</Text>
          <Text style={{color: "white", flex: 1, textAlign: 'center'}}>Map</Text>
          <Text style={{color: "white", flex: 1, textAlign: 'center'}}>Review</Text>
          <Text style={{color: "white", flex: 1, textAlign: 'center'}}>Cry</Text>
        </View>
        <View style={styles.container}>
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
    paddingBottom: 32
  },
  container: {
    padding: 10
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
  }
});


module.exports = ListingDetail;
