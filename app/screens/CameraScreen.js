import React, { Component } from 'react'
import {
  Text,
  View,
  Button,
  Image,
} from 'react-native'
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import firebase, {firestore} from '../firebase';

export default class CameraScreen extends React.Component {
  state = {
    image: null,
  }

  async componentDidMount() {
    await Permissions.askAsync(Permissions.CAMERA_ROLL);
    await Permissions.askAsync(Permissions.CAMERA);
  }

  render() {
    let { image } = this.state;
    return (
      <View>
        <Button
          onPress={this.takePhoto}
          title='Take a Picture'
        />
        {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
      </View>
    );
  }

  takePhoto = async () => {
    let pickerResult = await ImagePicker.launchCameraAsync({
      aspect: [4, 3]
    });
    if (!pickerResult.cancelled) {
      this.setState({ image: pickerResult.uri });
    }
  }

  // storeData = async () = {
  //   fireb
  // }
}
