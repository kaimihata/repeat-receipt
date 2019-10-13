import React, { Component } from 'react';
import {ScrollView} from 'react-native';
import {addDefaultData} from '../actions/addToFirestore';
import {ItemContainer, SearchBar} from '../components/ItemComponents';
import { NavigationEvents } from 'react-navigation';

export default class DataScreen extends React.Component {
  state = {
    keyWord: "",
    rerender: 0,
  }
  
  updateKeyWord = (word) => {
    this.setState({keyWord: word});
  }
  
  render() {
    return (
      <ScrollView 
        style={{ backgroundColor: 'white' }}
      >
        <NavigationEvents
          onWillFocus={() => {this.setState({ rerender: this.state.rerender + 1 })}}
        />
        <SearchBar update={this.updateKeyWord}/>
        <ItemContainer searchKeyWord={this.state.keyWord} refresh={this.state.rerender} />
      </ScrollView>
    );
  }
}