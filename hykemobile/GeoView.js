import React, {
  ActivityIndicatorIOS,
  AppRegistry,
  Component,
  Image,
  ListView,
  StyleSheet,
  TouchableHighlight,
  Text,
  View,
} from 'react-native';

class GeoView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showIndicator: false,
      hikes: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
    }
  }

  componentDidMount() {
    this.setState({
      showIndicator: true
    }, this._geolocate)
  }

  _geolocate = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this._fetchData(position);
      },
      (error) => alert(error.message),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
  }

  _fetchData = (position) => {
    fetch(`http://localhost:3000/hikes/geo/?lng=${position.coords.longitude}&lat=${position.coords.latitude}`, {
      headers: {
        'Accept': 'application/json',
      },
    })
    .then((response) => response.json())
    .then((hikes) => {
      this.setState({
        hikes: this.state.hikes.cloneWithRows(hikes),
        showIndicator: false
      });
    })
    .catch((error) => {
      alert('There was an error fetching hikes near you.')
    })
    .done();
  }

  _renderHike = (hike) => (
      <View style={styles.hikeContainer}>
        <Text style={styles.hike}>{hike.name}</Text>
        <Text style={styles.description}>{hike.description}</Text>
      </View>
    )

  _renderIndicator = () => (
    <ActivityIndicatorIOS
      animating={true}
      style={[styles.centering]}
      size="large"
    />
  )

  render() {
    return (
      <View style={styles.container}>
        {
          this.state.showIndicator
          ? this._renderIndicator()
          : null
        }
        <ListView
          automaticallyAdjustContentInsets={false}
          dataSource={this.state.hikes}
          renderRow={this._renderHike}
          style={styles.listView}
        />
      </View>
    )
  }
};

var styles = StyleSheet.create({
  container: {
    flex: 1
  },
  hikeContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#fafafa',
    paddingBottom: 10,
    paddingTop: 10
  },
  hike: {
    fontSize: 16,
    color: '#34AADC'
  },
  description: {
    fontSize: 12
  },
  listView: {
    marginTop: 68,
    backgroundColor: '#fff',
    paddingLeft: 10,
    paddingRight: 10,
    flex: 1
  },
  centering: {
    flex: 1,
    paddingTop: 28,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

module.exports = GeoView;
