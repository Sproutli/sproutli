'use strict';

var React = require('react-native');
var SearchBox = require('./SearchBox');
var Listing = require('./Listing');
var ListingDetail = require('./ListingDetail');
var {
  TextInput,
  StyleSheet,
  Text,
  ListView,
  View
} = React;

class Search extends React.Component {
  constructor(props) {
    super();
    this.state = {
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
      query: props.query
    };

    this.search();
  }

  search() {
    // TODO: Extract
    var query = this.state.query || '-adadadadad'
    fetch(`http://search-sproutli-bhzq3vdfhs5jhshdoqqt67ru5a.ap-southeast-2.cloudsearch.amazonaws.com/2013-01-01/search?q=${query}&size=20`)
      .then((res) => res.json())
      .then((listings) => {
        var listings = listings.hits.hit.map((l) => l.fields).filter((l) => l.name && l.name.length > 1);
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(listings)
        });
      })
      .catch((error) => {
        console.log('Error fetching listings', error);
      });
  }

  componentWillUpdate() {
  }

  _onChangeText(text) {
    this.setState({ query: text });
  }

  _onSearch() {
    this.search();
  }

  listingPressed(listing) {
    this.props.navigator.push({
      component: ListingDetail,
      title: listing.name,
      passProps: { listing }
    });
  }

  render() {
    return (
      <View style={styles.bigContainer}>
        <SearchBox onChangeText={this._onChangeText.bind(this)} onSubmitEditing={this._onSearch.bind(this)} />
        <ListView
          dataSource={this.state.dataSource}
          renderRow={(listing, index) => <Listing key={index} listing={listing} handler={this.listingPressed.bind(this, listing)} />}
        />
      </View>
    );
  }
};

var styles = StyleSheet.create({
  bigContainer: {
    flex: 1,
    paddingTop: 64,
    paddingBottom: 32
  },
});

module.exports = Search;
