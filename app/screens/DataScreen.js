import React, { Component } from 'react';
import {ScrollView} from 'react-native';
import {addDefaultData} from '../actions/addToFirestore';
import {ItemContainer, SearchBar} from '../components/ItemComponents';

export default class DataScreen extends React.Component {
  state = {
    keyWord: ""
  }
  
  updateKeyWord = (word) => {
    this.setState({keyWord: word});
  }
  
  render() {
    addDefaultData();
    return (
      <ScrollView>
        <SearchBar update={this.updateKeyWord}/>
        <ItemContainer searchKeyWord={this.state.keyWord} />
      </ScrollView>
    );
  }
}