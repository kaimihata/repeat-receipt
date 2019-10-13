import React, { Component } from 'react'
import { Text, View, TextInput, Button, StyleSheet } from 'react-native'
import firebase from '../firebase';

const styles = StyleSheet.create({
  input: {
    height: 40,
    width: '90%',
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
    marginTop: 8,
  },
  container: {
    paddingBottom: 20,
    alignItems: 'center',
  }
});

export default class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      errorMessage: null,
    }
  }

  handleSignUp = () => {
    const { email, password } = this.state;
    // authenticate user
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => this.initializeUser())
      .catch((error) => this.setState({ errorMessage: error.message }));
  }

  initializeUser = () => {
    const { currentUser } = firebase.auth();
    const { navigation } = this.props;
    navigation.navigate('Main');
  }

  render() {
    const {
      errorMessage,
      email,
      password,
    } = this.state;
    const { navigation } = this.props;
    return (
      <View>
        {errorMessage && (
          <Text style={{ color: 'red' }}>
            {errorMessage}
          </Text>
        )}
        <View style={styles.container}>
          <TextInput
            placeholder="Email"
            autoCapitalize="none"
            style={styles.input}
            onChangeText={(e) => this.setState({ email: e })}
            value={email}
            keyboardType="email-address"
          />
          <TextInput
            secureTextEntry
            placeholder="Password"
            style={styles.input}
            autoCapitalize="none"
            onChangeText={(p) => this.setState({ password: p })}
            value={password}
          />
        </View>
        <Button title="Sign Up" onPress={this.handleSignUp} />
        <Button
          title="Switch to Login"
          onPress={() => navigation.navigate('Login')}
        />
      </View>
    );
  }
}
