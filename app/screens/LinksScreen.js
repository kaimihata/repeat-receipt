import React from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Button,
} from 'react-native';
import CameraScreen from './CameraScreen';

export default function LinksScreen() {
  return (
    <CameraScreen />
  );
}

LinksScreen.navigationOptions = {
  title: 'Scan Receipt',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});
