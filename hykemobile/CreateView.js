import React, {
  ActivityIndicatorIOS,
  AppRegistry,
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

var difficulties = t.enums({
  Easy: 'Easy',
  Moderate: 'Moderate',
  Difficult: 'Difficult'
});

var Hike = t.struct({
  name: t.String,
  length: t.refinement(t.Number, function (n) { return n > 0; }),
  elevation: t.refinement(t.Number, function (n) { return n > 0; }),
  description: t.String,
  difficulty: difficulties,
  beach: t.Boolean,
  cave: t.Boolean,
  forest: t.Boolean,
  lake: t.Boolean,
  river: t.Boolean,
  views: t.Boolean,
  waterfall: t.Boolean,
  wildflowers: t.Boolean,
  wildlife: t.Boolean,
  city: t.String,
  district: t.String,
  country: t.String,
  latitude: t.Number,
  longitude: t.Number
});

var options = {
  fields: {
    name: {
      error: 'Enter a valid name'
    },
    length: {
      error: 'Enter a valid length'
    },
    elevation: {
      error: 'Enter a valid elevation'
    },
    description: {
      error: 'Enter a valid description'
    },
    difficulty: {
      error: 'Choose a difficulty'
    },
  }
};

class CreateView extends Component {

  constructor(props) {
    super(props)
    this.state = {
      value: {
        name: '',
        length: null,
        elevation: null,
        description: '',
        difficulty: '',
        city: '',
        district: '',
        country: '',
        latitude: null,
        longitude: null
      }
    }
  }

  componentWillUnmount() {
    this.setState = {
      value: {
        name: '',
        length: null,
        elevation: null,
        description: '',
        difficulty: '',
        city: '',
        district: '',
        country: '',
        latitude: null,
        longitude: null
      }
    }
  }

  _onChange = (value) => {
    this.setState({
      value
    })
  }

  _handleGeolocate = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        var newState = Object.assign({}, this.state.value);
        newState.longitude = position.coords.longitude;
        newState.latitude = position.coords.latitude;
        this.setState({
          value: newState
        }, console.log(this.state))
      },
      (error) => alert(error.message),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
  }

  _handleAdd = () => {
    var value = this.refs.form.getValue();
    // If the form is valid...
    if (value) {
      // Manipulate the form data so that it is in the correct format before
      // we submit to the API.
      var data = {
        name: value.name,
        length: value.length,
        elevation: value.elevation,
        description: value.description,
        difficulty: value.difficulty,
        location: {
          city: value.city,
          district: value.district,
          country: value.country,
          loc: [value.longitude, value.latitude]
        },
        features: [
          value.beach ? 'Beach' : null,
          value.cave ? 'Cave' : null,
          value.forest ? 'Forest' : null,
          value.lake ? 'Lake' : null,
          value.river ? 'River' : null,
          value.views ? 'Views' : null,
          value.waterfall ? 'Waterfall' : null,
          value.wildflowers ? 'Wildflowers' : null,
          value.wildlife ? 'Wildlife' : null,
        ]
      }
      // Remove null values from the features array
      data.features = data.features.filter((val) => val !== null);
      // Serialize and post the data
      var data = JSON.stringify(data);
      fetch(`http://52.90.113.54/hikes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: data
      })
      .then((response) => response.json())
      .then((hike) => {
        alert(`${hike.name} was added!`);
        // Redirect to home screen
        this.props.navigator.pop();
      })
      .catch((error) => {
        console.log(error);
        alert('There was an error adding your hike.');
      })
      .done();
    } else {
      // Form validation error
      alert('Please fix the errors listed and try again.')
    }
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <Form
          ref='form'
          type={Hike}
          options={options}
          value={this.state.value}
          onChange={this._onChange}
        />
        <TouchableHighlight onPress={this._handleGeolocate}>
          <Text style={[styles.button, styles.blueButton]}>Use My Location</Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={this._handleAdd}>
          <Text style={[styles.button, styles.greenButton]}>Add Hike</Text>
        </TouchableHighlight>
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
  blueButton: {
    backgroundColor: '#34AADC',
  },
  centering: {
    alignItems: 'center',
    justifyContent: 'center',
  }
});

module.exports = CreateView;
