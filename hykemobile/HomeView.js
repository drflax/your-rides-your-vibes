import React, {
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

var GeoView = require('./GeoView');
var CreateView = require('./CreateView');
var RegisterView = require('./RegisterView');
var LoginView = require('./LoginView');
var UserReviews = require('./UserReviews');
var CreateReviewView = require('./CreateReviewView');
var HikeListView = require('./HikeListView');

class HomeView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      authenticated: false
    }
  }
  _setAuthStatus = (authenticated) => {
    this.setState({ authenticated })
  }
  _handleGeoView = () => {
    this.props.navigator.push({
      title: 'Hikes Near Me',
      component: GeoView,
      backButtonTitle: 'Back'
    })
  }
  _handleCreateView = () => {
    this.props.navigator.push({
      title: 'Add New Hike',
      component: CreateView,
      backButtonTitle: 'Back'
    })
  }
  _handleRegister = () => {
    this.props.navigator.push({
      title: 'Register New Account',
      component: RegisterView,
      backButtonTitle: 'Back'
    })
  }
  _handleUserReviews = () => {
    this.props.navigator.push({
      title: 'My Hike Reviews',
      component: UserReviews,
      backButtonTitle: 'Back'
    })
  }
  _handleCreateReview = () => {
    this.props.navigator.push({
      title: 'Choose a Hike to Review',
      component: HikeListView,
      backButtonTitle: 'Back'
    })
  }
  _handleLogIn = () => {
    this.props.navigator.push({
      title: 'LogIn',
      component: LoginView,
      backButtonTitle: 'Back',
      passProps: { setAuthStatus: this._setAuthStatus }
    })
  }
  _handleLogOut = () => {
    AsyncStorage.removeItem('jwt')
    alert('You have been logged out.')
    this._setAuthStatus(false)
  }
  render() {
    return (
      <View style={styles.container}>
        {
          !this.state.authenticated
          ?
            <View>
              <TouchableHighlight onPress={this._handleRegister}>
                <Text style={[styles.button]}>
                  Register
                </Text>
              </TouchableHighlight>
              <TouchableHighlight onPress={this._handleLogIn}>
                <Text style={[styles.button]}>
                  Log In
                </Text>
              </TouchableHighlight>
            </View>
          :
            <View>
              <TouchableHighlight onPress={this._handleLogOut}>
                <Text style={[styles.button]}>
                  Log Out
                </Text>
              </TouchableHighlight>
              <TouchableHighlight onPress={this._handleUserReviews}>
                <Text style={[styles.button]}>
                  My Hike Reviews
                </Text>
              </TouchableHighlight>
              <TouchableHighlight onPress={this._handleCreateView}>
                <Text style={[styles.button]}>
                  Add New Hike
                </Text>
              </TouchableHighlight>
              <TouchableHighlight onPress={this._handleCreateReview}>
                <Text style={[styles.button]}>
                  Add New Hike Review
                </Text>
              </TouchableHighlight>
            </View>
        }
        <TouchableHighlight onPress={this._handleGeoView}>
          <Text style={[styles.button]}>
            Hikes Near Me
          </Text>
        </TouchableHighlight>
      </View>
    )
  }
};

var styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 80,
    flex: 1,
    flexDirection: 'column'
  },
  authContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'center'
  },
  button: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 4,
    padding: 20,
    textAlign: 'center',
    marginBottom: 20,
    color: '#777',
    backgroundColor: '#fff'
  },
  greenButton: {
    backgroundColor: '#4CD964'
  },
  blueButton: {
    backgroundColor: '#34AADC',
  }
});

module.exports = HomeView;
