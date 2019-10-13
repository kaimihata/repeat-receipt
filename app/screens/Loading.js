import React, { Component } from 'react'
import { Text, View, ActivityIndicator, TextInput } from 'react-native'
import firebase from '../firebase';

export default class Loading extends Component {
  componentDidMount() {
    const { navigation } = this.props;
    firebase.auth().onAuthStateChanged((user) => {
      navigation.navigate(user ? 'Main' : 'SignUp');
    })
  }
  render() {
    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <ActivityIndicator />
      </View>
    )
  }
}
