import React, {
  ActivityIndicatorIOS,
  AppRegistry,
  AsyncStorage,
  Component,
  Image,
  ListView,
  StyleSheet,
  TouchableHighlight,
  Text,
  View,
} from 'react-native';

var CreateReviewView = require('./CreateReviewView');

class HikeListView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showIndicator: false,
      hikes: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
    }
  }

  _handleCreateReview = (hike) => {
    console.log(hike)
    this.props.navigator.push({
      title: 'Write a New Review',
      component: CreateReviewView,
      backButtonTitle: 'Back',
      passProps: { hike }
    })
  }

  componentDidMount() {
    this.setState({
      showIndicator: true
    }, this._fetchData)
  }

  _fetchData = () => {
    AsyncStorage.getItem('jwt', (err, token) => {
      fetch('http://52.90.113.54/hikes/all', {
        headers: {
          Accept: 'application/json',
          Authorization: `JWT ${token}`
        }
      })
      .then((response) => response.json())
      .then((hikes) => {
        this.setState({
          hikes: this.state.hikes.cloneWithRows(hikes),
          showIndicator: false
        });
      })
      .catch((error) => {
        alert('There was an error fetching the hikes.')
      })
      .done();
    })
  }

  _renderHike = (hike) => (
      <View style={styles.hikeContainer}>
        <TouchableHighlight onPress={this._handleCreateReview.bind(null, hike)}>
          <Text style={styles.hike}>{hike.name}</Text>
        </TouchableHighlight>
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

module.exports = HikeListView;
