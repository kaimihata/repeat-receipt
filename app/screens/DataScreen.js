import React, { Component } from 'react';
import { View, Text} from 'react-native';
import firebase, {firestore} from '../firebase';
import {addDefaultData} from '../actions/addToFirestore';

export default class DataScreen extends React.Component {
  state = {
    priceTest: null,
  }
  
  render() {
    addDefaultData();
    return (
      <View>
        {/* <Text>{this.state.priceTest}</Text> */}
        <ItemContainer />
      </View>
    );
  }
}

class ItemContainer extends React.Component {
  state = {
    items: <Text>Loading...</Text>,
  }

  componentDidMount() {
    this.fillItems();
  }

  fillItems() {
    var currentItems = [];
    firestore.collection("user1").get().then((queryItems) => {
      queryItems.forEach((item) => {
        currentItems.push(<ItemBox key={item.id} item={item} />)
      });
      this.setState({items: currentItems});
    });
  }
  
  render() {
    return <View>{this.state.items}</View>;
  }
}

class ItemBox extends React.Component {
  state = {
    instances: <Text>Loading...</Text>,
  }
  
  componentDidMount() {
    var currentInstances = [];
    // this.props.item.ref.collection("purchaseInstances").get().then((purchaseInstances) => {
    this.props.item.get("instances").forEach((instance) => {
      currentInstances.push(<Instance instance={instance} key={JSON.stringify(instance)}/>);
    });
    this.setState({instances: currentInstances});
  }

  render() {
    return (
      <View>
        <Text style={{fontWeight: "bold"}}>{this.props.item.id}:</Text>
        {this.state.instances}
        <Text>{"\n"}</Text>
      </View>
    );
  }
}

class Instance extends React.Component {
  render() {
    return <Text>{JSON.stringify(this.props.instance)}</Text>;
  }
}