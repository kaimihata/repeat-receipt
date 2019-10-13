import firebase, {firestore} from '../firebase';
import React, { Component } from 'react';
import { View, Text, TextInput } from 'react-native';

export class SearchBar extends React.Component {
  render() {
    return (
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
        onChangeText={(text) => {
          console.log("callback ran!");
          this.props.update(text);
        }}
        placeholder='Search'
      />
    );
  }
}

export class Instance extends React.Component {
  render() {
    return (
      <View style={{paddingTop:7}}>
        <Text>${this.props.instance["price"]}:</Text>
        <Text>{this.props.instance["date"]} at {this.props.instance["location"]}</Text>
      </View>
    );
  }
}

export class ItemContainer extends React.Component {
  state = {
    // items: [<Text>Loading...</Text>],
    items: null,
  }

  componentDidMount() {
    this.fillItems();
  }

  fillItems() {
    var currentItems = [];
    firestore.collection("user1").get().then((queryItems) => {
      queryItems.forEach((item) => {
        currentItems.push(item)
      });
      this.setState({items: currentItems});
    });
  }
  
  render() {
    if (this.state.items != null) {
      var items = this.state.items.filter((item) => {
        return item.get("name").toLowerCase().includes(this.props.searchKeyWord.toLowerCase());
      })
        .map((item) => <ItemBox key={item.id} item={item}/>);
      return (
        <View style={{flexDirection:'column', justifyContent:"space-between", padding:7}}>
          {items.length == 0 ? <Text>No results found</Text> : items}
        </View>
      );
    } else {
      return <Text>Loading...</Text>
    }
  }
}

export class ItemBox extends React.Component {
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