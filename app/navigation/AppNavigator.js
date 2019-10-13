import React, { Component } from 'react';
import { Text, TextInput } from 'react-native';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import MainTabNavigator from './MainTabNavigator';
import Loading from '../screens/Loading';
import SignUp from '../screens/SignUp';
import Login from '../screens/Login';

const AuthStack = createStackNavigator({
  Loading: {
    screen: Loading,
    navigationOptions: {
      header: null,
    },
  },
  SignUp: {
    screen: SignUp,
    navigationOptions: {
      headerTitle: <Text style={{  fontSize: 18 }}>Sign Up</Text>,
      headerLeft: null,
      gesturesEnabled: false,
    },
  },
  Login: {
    screen: Login,
    navigationOptions: {
      headerTitle: <Text style={{ fontSize: 18 }}>Login</Text>,
      headerLeft: null,
      gesturesEnabled: false,
    },
  },
});

const AppContainer = createAppContainer(
  createSwitchNavigator({
    Auth: AuthStack,
    Main: MainTabNavigator
  },
  { initialRouteName: 'Auth' }),
);

class AppNavigation extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return <AppContainer screenProps={this.props} />;
  }
}

export default AppNavigation;
