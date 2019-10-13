import React, { Component } from 'react';
import { View, Text} from 'react-native';
import firebase, {firestore} from '../firebase';

export default class DataScreen extends React.Component {
  state = {
    priceTest: null,
  }

  async componentDidMount() {
    var item = firestore.collection("user").doc("item1").collection("purchaseInstances").doc("instance1");
    item.get().then((doc) => {
        if (doc.exists) {
          this.setState({priceTest: doc.data().price});
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
  }
  
  render() {
    return (
      <View>
        <Text>{this.state.priceTest}</Text>
      </View>
    );
  }
}