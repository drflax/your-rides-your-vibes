import React, {
  ActivityIndicatorIOS,
  AppRegistry,
  AsyncStorage,
  Component,
  Image,
  ListView,
  ScrollView,
  StyleSheet,
  TouchableHighlight,
  Text,
  View,
} from 'react-native';

var HomeView = require('./HomeView');

var t = require('tcomb-form-native');

var Form = t.form.Form

var rating = t.enums({
  1: '1',
  2: '2',
  3: '3',
  4: '4',
  5: '5'
});

var Review = t.struct({
  description: t.String,
  rating: rating
});

var options = {
  fields: {
    description: {
      error: 'Enter a valid review'
    },
    rating: {
      error: 'Enter a valid rating'
    }
  }
};

class CreateView extends Component {

  constructor(props) {
    super(props)
    this.state = {
      value: {
        description: '',
        rating: ''
      }
    }
    if (this.props.edit) {
      this._fetchReview()
    }
  }

  componentWillUnmount() {
    this.setState = {
      value: {
        description: '',
        rating: ''
      }
    }
  }

  _onChange = (value) => {
    this.setState({
      value
    })
  }

  _handleDelete = () => {
    AsyncStorage.getItem('jwt', (err, token) => {
      fetch(`http://localhost:3000/reviews/${this.props.review._id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `JWT ${token}`
          }
        })
        .then((response) => response.json())
        .then((json) => {
          alert(`Your review was deleted!`);
          this.props.navigator.popToTop()
        })
        .catch((error) => {
          alert('There was an error deleting your review.');
        })
        .done();
    })
  }


  _handleAdd = () => {
    var value = this.refs.form.getValue();
    // If the form is valid...
    if (value) {
      // Manipulate the form data so that it is in the correct format before
      // we submit to the API.
      var data = {
          rating: value.rating,
          description: value.description,
          hikeId: (
            this.props.edit
            ? this.props.review.hikeId
            : this.props.hike._id
          )
        }
        // Serialize and post the data
      var data = JSON.stringify(data);
      console.log(data)
      const method = this.props.edit ? 'PUT' : 'POST'
      const url = (
        this.props.edit
        ? `http://localhost:3000/reviews/${this.props.review._id}`
        : 'http://localhost:3000/reviews'
      )
      AsyncStorage.getItem('jwt', (err, token) => {
        fetch(url, {
            method: method,
            headers: {
              'Content-Type': 'application/json',
              Authorization: `JWT ${token}`
            },
            body: data
          })
          .then((response) => response.json())
          .then((json) => {
            alert(`Your review was ${this.props.edit ? 'updated' : 'added'}!`);
            this.props.navigator.popToTop()
          })
          .catch((error) => {
            alert('There was an error updating your review.');
          })
          .done();
      })
    } else {
      // Form validation error
      alert('Please fix the errors listed and try again.')
    }
  }

  _fetchReview = () => {
    AsyncStorage.getItem('jwt', (err, token) => {
      fetch(`http://localhost:3000/reviews/${this.props.review._id}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `JWT ${token}`
          }
        })
        .then((response) => response.json())
        .then((json) => {
          this.setState({
            value: {
              description: json.description,
              rating: json.rating
            }
          })
        })
        .catch((error) => {
          alert('There was an error fetching your review.');
        })
        .done();
    })
  }


  render() {
    return (
      <ScrollView style={styles.container}>
        {
          !this.props.edit
          ?
            <Text style={styles.header}>Write a review for {this.props.hike.name}:</Text>
          : null
        }
        <Form
          ref='form'
          type={Review}
          options={options}
          value={this.state.value}
          onChange={this._onChange}
        />
        <TouchableHighlight onPress={this._handleAdd}>
          <Text style={[styles.button, styles.greenButton]}>
            { this.props.edit ? 'Edit' : 'Add'}{' '}Review
          </Text>
        </TouchableHighlight>
        {
          this.props.edit
          ?
            <TouchableHighlight onPress={this._handleDelete}>
              <Text style={[styles.button, styles.redButton]}>
                Delete Review
              </Text>
            </TouchableHighlight>
          : null
        }
      </ScrollView>
    )
  }
};

var description = StyleSheet.create({
  textbox: {
    height: 100
  }
})

var styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    flexDirection: 'column'
  },
  header: {
    marginBottom: 20
  },
  button: {
    borderRadius: 4,
    padding: 20,
    textAlign: 'center',
    marginBottom: 20,
    color: '#fff'
  },
  greenButton: {
    backgroundColor: '#4CD964'
  },
  redButton: {
    backgroundColor: '#ff2d55',
  },
  centering: {
    alignItems: 'center',
    justifyContent: 'center',
  }
});

module.exports = CreateView;
