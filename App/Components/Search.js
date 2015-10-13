'use strict';

var React = require('react-native');
var SearchBox = require('./SearchBox');
var {
  TextInput,
  StyleSheet,
  Text,
  ListView,
  View
} = React;

class Search extends React.Component {
  constructor() {
    super();
    this.state = {
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    };

    fetch('http://search-sproutli-bhzq3vdfhs5jhshdoqqt67ru5a.ap-southeast-2.cloudsearch.amazonaws.com/2013-01-01/search?q=-adadad&size=1000')
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

  render() {
    return (
      <View style={styles.bigContainer}>
        <SearchBox />
        <ListView
          dataSource={this.state.dataSource}
          renderRow={(rowData, index) => <Text key={index}>{rowData.name}</Text>}
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
  }
});

module.exports = Search;
