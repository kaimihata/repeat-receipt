import React from 'react';
import { View } from 'react-native';
import DataScreen from './DataScreen';
import { ExpoConfigView } from '@expo/samples';

export default function SettingsScreen() {
  /**
   * Go ahead and delete ExpoConfigView and replace it with your content;
   * we just wanted to give you a quick view of your config.
   */
  return (
    <View>
      <DataScreen />
    </View>
  );
}

SettingsScreen.navigationOptions = {
  title: 'Purchase History',
};
