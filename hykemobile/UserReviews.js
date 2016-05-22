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

class UserReviews extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showIndicator: false,
      reviews: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
    }
  }

  _handleEditReview = (review) => {
    this.props.navigator.push({
      title: 'Edit Your Review',
      component: CreateReviewView,
      backButtonTitle: 'Back',
      passProps: { review, edit: true }
    })
  }

  componentDidMount() {
    this.setState({
      showIndicator: true
    }, this._fetchData)
  }

  _fetchData = () => {
    AsyncStorage.getItem('jwt', (err, token) => {
      fetch('http://localhost:3000/reviews/me', {
        headers: {
          Accept: 'application/json',
          Authorization: `JWT ${token}`
        }
      })
      .then((response) => response.json())
      .then((reviews) => {
        this.setState({
          reviews: this.state.reviews.cloneWithRows(reviews),
          showIndicator: false
        });
      })
      .catch((error) => {
        alert('There was an error fetching your reviews.')
      })
      .done();
    })
  }

  _renderReview = (review) => (
    <TouchableHighlight onPress={this._handleEditReview.bind(null, review)}>
      <View style={styles.reviewContainer}>
        <Text style={styles.review}>{review.rating}/5</Text>
        <Text style={styles.description}>{review.description}</Text>
        <Text style={styles.description}>Added on {review.created}</Text>
      </View>
    </TouchableHighlight>
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
          dataSource={this.state.reviews}
          renderRow={this._renderReview}
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
  reviewContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#fafafa',
    paddingBottom: 10,
    paddingTop: 10
  },
  review: {
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

module.exports = UserReviews;
