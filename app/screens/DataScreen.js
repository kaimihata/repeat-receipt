import React, { Component } from 'react';
import { View, Text, ScrollView } from 'react-native';
import firebase, {firestore} from '../firebase';
import {addDefaultData} from '../actions/addToFirestore';

export default class DataScreen extends React.Component {
  render() {
    addDefaultData();
    return (
      <ScrollView>
        <ItemContainer />
      </ScrollView>
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
        currentItems.push(<ItemBox key={item.id} item={item}/>)
      });
      this.setState({items: currentItems});
    });
  }
  
  render() {
    return <View style={{flexDirection:'column', justifyContent:"space-between", padding:7}}>
      {this.state.items}
    </View>;
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
      currentInstances.push(instance);
    });
    this.setState({instances: currentInstances.sort((a,b) => a["price"] - b["price"])
      .map((e) => <Instance instance={e} key={JSON.stringify(e)}/>)});
  }

  render() {
    return (
      <View style={{
        backgroundColor:"lightgrey", borderRadius:10, padding:10, margin:7,
        shadowColor:"grey", shadowOffset:{width:1,height:1}, shadowOpacity:10, shadowRadius:5
      }}>
        <Text style={{fontWeight: "bold"}}>{this.props.item.id}:</Text>
        <View style={{padding:10}}>
          {this.state.instances}
        </View>
      </View>
    );
  }
}

class Instance extends React.Component {
  render() {
    return (
      <View style={{paddingTop:7}}>
        <Text>${this.props.instance["price"]}:</Text>
        <Text>{this.props.instance["date"]} at {this.props.instance["location"]}</Text>
      </View>
    );
  }
}