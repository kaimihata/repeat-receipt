import React, { Component } from 'react'
import {
  Text,
  View,
  Button,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  StyleSheet,
  Dimensions,
  Modal,
  TouchableHighlight,
  TouchableWithoutFeedback,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';
import { RNCamera } from 'react-native-camera';
import * as Permissions from 'expo-permissions';
import firebase from '../firebase';
import getEnvVars from '../environment';
import uuid from 'uuid';
import * as keywords from '../assets/keywords/keywords.json';
import addToFirestore from '../actions/addToFirestore';
import { white } from 'ansi-colors';
import { withNavigation } from 'react-navigation';
import { MaterialIndicator } from 'react-native-indicators';

const win = Dimensions.get('window');

const styles = StyleSheet.create({
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  }
})

class CameraScreen extends React.Component {
  state = {
    image: null,
    uploading: false,
    gcpResponse: null,
    itemObjects: null,
    type: Camera.Constants.Type.back,
    takingPhoto: false,
    analyzing: false,
    modalVisible: false,
  }

  async componentDidMount() {
    await Permissions.askAsync(Permissions.CAMERA_ROLL);
    await Permissions.askAsync(Permissions.CAMERA);
    await Permissions.askAsync(Permissions.AUDIO_RECORDING);
  }

  render() {
    let { image, itemObjects, type, uploading, takingPhoto, analyzing } = this.state;
    if (takingPhoto) {
      return (
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <ActivityIndicator size="large" />
        </View>
      )
    } else if (image) {
      return (
        <View style={{
          flex: 1,
          alignItems: 'center',
        }}>
          <Image source={{ uri: image }}
            style={{
              flex: 1,
              alignSelf: 'stretch',
              width: win.width,
              height: win.height,
            }} />
          {/* {itemObjects && <Text>{JSON.stringify(itemObjects)}</Text>} */}
          <Ionicons
            name={'ios-close'}
            size={80}
            color='#ffffff'
            style={{
              position: 'absolute',
              top: -10,
              left: 0,
              padding: 10,
            }}
            onPress={this.retake}
          />
          {analyzing && <MaterialIndicator
            style={{
              position: 'absolute',
              top: win.height/2,
            }}
            color='white'
          />}
          
          <View style={{
            flex: 1,
            justifyContent: 'center',
            flexDirection: 'row',
            bottom: 0,
            position: 'absolute'
          }}>
            <TouchableOpacity
              style={{
                backgroundColor: '#32CD32',
                width: win.width,
                padding: 15,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={this.gcpAnalyze}
            >
              <Text style={{ fontSize: 30, color: '#ffffff', textDecorationLine: 'underline' }}>Analyze</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity
              style={{
                backgroundColor: '#78C5EF',
                padding: 10,
                margin: 10,
                borderRadius: 5,
              }}
              onPress={this.retake}
            >
              <Text>Retake Photo</Text>
            </TouchableOpacity> */}
          </View>
        </View>
      );
    } else {
      return (
        <View style={{ flex: 1 }}>
          <Modal
            animationType="slide"
            transparent
            visible={this.state.modalVisible}
            onRequestClose={() => {
              Alert.alert('Modal has been closed.');
            }}>
            <TouchableOpacity
            style={{
              width: win.width,
              height: win.height,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPressOut={() => this.setState({ modalVisible: false })}
            >
              <TouchableWithoutFeedback>
                <View style={{
                  marginTop: 22,
                  width: '70%',
                  height: '12%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#ffffff',
                  borderRadius: 15,
                }}>
                  <View>
                    <Text style={{ fontSize: 20 }}>Couldn't detect any text!</Text>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </TouchableOpacity>
          </Modal>
          {!image && <Camera style={{ flex: 1 }} type={this.state.type}
            ref={ref => {
              this.camera = ref;
            }}>
            <View
              style={{
                flex: 1,
                backgroundColor: 'transparent',
                justifyContent: 'space-between',
              }}>
              <TouchableOpacity
                style={{
                  alignSelf: 'flex-end',
                  alignItems: 'center',
                }}
                onPress={() => {
                  this.setState({
                    type:
                      this.state.type === Camera.Constants.Type.back
                        ? Camera.Constants.Type.front
                        : Camera.Constants.Type.back,
                  });
                }}>
                <Ionicons
                  name={'ios-repeat'}
                  style={{ padding: 10 }}
                  size={40}
                  color={'#ffffff'}
                />
              </TouchableOpacity>
              <View style={{ alignItems: 'center' }}>
                <TouchableOpacity
                  style={{
                    justifyContent: 'flex-end',
                    alignSelf: 'center',
                    alignItems: 'center',
                  }}
                  onPress={this.snap.bind(this)}>
                  <Ionicons
                    name={'ios-radio-button-off'}
                    style={{ padding: 10 }}
                    size={80}
                    color={'#ffffff'}
                  />
                </TouchableOpacity>
              </View>

            </View>
          </Camera>}
        </View>
      );
    }
  }

  async snap() {
    if (this.camera) {
      this.setState({ takingPhoto: true });
      const options = {
        quality: 1, base64: true, fixOrientation: true,
        exif: true
      };
      await this.camera.takePictureAsync(options).then(async photo => {
        photo.exif.Orientation = 1;
        uploadUrl = await this.uploadImageAsync(photo.uri);
        this.setState({ image: uploadUrl, takingPhoto: false });
      });
    }
  }

  // takePhoto = async () => {
  //   this.setState({ uploading: true });
  //   let pickerResult = await ImagePicker.launchCameraAsync({
  //     aspect: [4, 3]
  //   });
  //   if (!pickerResult.cancelled) {
  //     uploadUrl = await this.uploadImageAsync(pickerResult.uri);
  //     this.setState({ image: uploadUrl });
  //   }
  //   this.setState({ uploading: false });
  // }

  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  }
  
  retake = () => {
    this.setState({ image: null });
  }
  // storeData = async () = {
  //   fireb
  // }
  uploadImageAsync = async (uri) => {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError('Network request failed'));
      };
      xhr.responseType = 'blob';
      xhr.open('GET', uri, true);
      xhr.send(null);
    })

    const ref = firebase.storage().ref().child(uuid.v4());
    const snapshot = await ref.put(blob);

    blob.close();
    return await snapshot.ref.getDownloadURL();
  }

  gcpAnalyze = async () => {
    try {
      this.setState({ uploading: true, analyzing: true });
      let { image } = this.state;
      let body = JSON.stringify({
        requests: [
          {
            features: [
              { type: "DOCUMENT_TEXT_DETECTION", maxResults: 5 },
            ],
            image: {
              source: {
                imageUri: image
              }
            }
          }
        ]
      });
      const { GCP_VISION_APIKEY } = getEnvVars();
      let response = await fetch(
        "https://vision.googleapis.com/v1/images:annotate?key=" +
        GCP_VISION_APIKEY,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          method: "POST",
          body: body
        }
      );
      let responseJSON = response.json().then((resp) => {
        console.log(resp);
        this.processOCR(resp);
      });
      // console.log(responseJSON);
      // this.processOCR(responseJSON);
      this.setState({
        googleResponse: responseJSON,
        uploading: false
      });
    } catch (error) {
      console.log(error);
    }
  }

  processOCR = (response) => {
    // const blocksRef = response['responses'][0]['fullTextAnnotation']['pages'][0]['blocks'];
    // const symbolsRef = blocksRef[0]['paragraphs'][0]['words'][0]['symbols'];
    // console.log(symbolsRef);
    // console.log(blocksRef[0]['paragraphs'][0]['words'][0]['symbols'].length);
    // for (i = 0; i < symbolsRef.length; i++) {
    //   console.log(symbolsRef[i]['text']);
    // }
    console.log('Process OCR');
    // console.log(response);
    let test = response['responses']
    let words = [];
    data = [];
    let sumDeltaY = 0;
    let numWords = 0;
    for (n = 0; n < test.length; n++) {
      if (test[n] == null || test[n]['fullTextAnnotation'] == null || test[n]['fullTextAnnotation']['pages'] == null) {
        this.setState({ analyzing: false, modalVisible: true });
        this.retake();
        return;
      }
      let resp = test[n]['fullTextAnnotation']['pages'];
      for (m = 0; m < resp.length; m++) {
        let page = resp[m]['blocks'];
        for (l = 0; l < page.length; l++) {
          let block = page[l]['paragraphs'];
          for (k = 0; k < block.length; k++) {
            let paragraph = block[k]['words'];
            paragraphArr = [];
            for (j = 0; j < paragraph.length; j++) {
              let word = paragraph[j]['symbols'];
              let t = "";
              for (i = 0; i < word.length; i++) {
                t += word[i]['text'];
              }
              let w = {
                vertices: paragraph[j]['boundingBox']['vertices'],
                text: t,
                avgY: this.computeAverageY(paragraph[j]['boundingBox']['vertices']),
                avgX: this.computeAverageX(paragraph[j]['boundingBox']['vertices']),
              }
              sumDeltaY += Math.abs(w.vertices[2].y - w.vertices[1].y);
              numWords++;
              paragraphArr.push(w);
              words.push(w);
            }
            // console.log(paragraphArr);
          }
        }
      }
    }
    // console.log(words);
    items = this.groupLines(words, (sumDeltaY / numWords) / 2);
    this.setState({ itemObjects: items, analyzing: false });
    addToFirestore({ items }, (v) => this.props.navigation.navigate(v), "Settings");
  }


  groupLines(data, margin) {
    data.sort((a, b) => {
      return a.avgY - b.avgY;
    });

    let lines = [];
    let skip = new Set([]);
    for (i = 0; i < data.length; i++) {
      if (!skip.has(i)) {
        let l = [];
        l.push(data[i]);
        let y = data[i].avgY;
        for (j = i + 1; j < data.length; j++) {
          if (!skip.has(j)) {
            if (Math.abs(y - data[j].avgY) <= margin) {
              l.push(data[j]);
              skip.add(j);
            }
          }
        }
        l.sort((a, b) => {
          return a.avgX - b.avgX;
        });
        lines.push(l);
      }
    }
    // console.log(lines);
    // console.log(lines[0][0].text);
    let items = [];
    let date = [];
    let store = [];
    for (i = 0; i < lines.length; i++) {
      str = "";
      for (j = 0; j < lines[i].length; j++) {
        str += lines[i][j].text + " ";
        // console.log(lines[i][j][0].text);
      }
      // console.log(str);
      var classification = this.classifyLine(lines[i]);
      if (classification === 0) {
        items.push(lines[i]);
      } else if (classification === 1) {
        date.push(lines[i]);
      } else if (classification === 2) {
        store.push(lines[i]);
      }
    }
    // console.log("items", items);
    groupedItems = [];
    items.forEach((arr) => {
      groupedItems.push(this.groupBoxes(arr));
    });
    console.log(groupedItems);
    var itemObjects = [];
    groupedItems.forEach((arr) => {
      var title = arr[0].text;
      arr.forEach((elem) => {
        if (elem.text.length > title.length) {
          title = elem.text;
        }
      });
      var temp = arr[arr.length - 1].text.split(" ");
      // console.log(temp);
      var price = "0.0";
      var point = temp.findIndex((element) => {
        return element === '.';
      });
      // console.log(point);
      if (point < temp.length - 1 && point > 0) {
        price = temp[point - 1] + '.' + temp[point + 1];
      }
      var obj = {
        name: title,
        instances: [
          {
            price,
            date: date.length === 0 ? null : this.extractDateFromLine(date[0]),
            location: store.length === 0 ? null : this.extractStoreFromLine(store[0]),
          }
        ],
      }
      itemObjects.push(obj);
      // console.log(title + " " + price);
    });
    // console.log("items", groupedItems);
    // console.log("items", itemObjects);
    // console.log("date", this.extractDateFromLine(date[0]));
    // console.log("store", store);
    // console.log(this.groupBoxes(items[0]));
    return itemObjects;
  }

  computeAverageY(vertices) {
    return (vertices[0].y + vertices[1].y + vertices[2].y + vertices[3].y) / 4;
  }

  computeAverageX(vertices) {
    return (vertices[0].x + vertices[1].x + vertices[2].x + vertices[3].x) / 4;
  }

  combineArray(arr) {
    let str = "";
    for (i = 0; i < arr.length; i++) {
      str += arr[i] + " ";
    }
    return str;
  }

  arrToString(arr) {
    var str = "";
    arr.forEach((elem) => {
      str += elem.text + " ";
    });
    return str;
  }

  extractPriceFromLine(arr) {
    var r = null;
    var str = this.arrToString(arr).toLowerCase();
    var contains = keywords["non_item"].some((elem) => {
      if (str.includes(elem)) {
        return true;
      }
      return false;
    });
    if (contains) {
      return null;
    }

    var point = arr.findIndex((element) => {
      return element.text === '.';
    });
    if (point < arr.length - 1 && point > 0 && !isNaN(arr[point - 1].text)) {
      return arr[point - 1].text + '.' + arr[point + 1].text;
    }
    return null;
  }

  extractDateFromLine(arr) {
    var point = arr.findIndex((element) => {
      return element.text === '/';
    });
    if (point < arr.length - 3 && point > 0) {
      if (arr[point + 2].text === '/') {
        return arr[point - 1].text + '/' + arr[point + 1].text + '/' + arr[point + 3].text;
      }
    }
    return null;
  }

  extractStoreFromLine(arr) {
    // var a = "mcdonald ' s restaurant # 1697 ";
    var r = null;
    var str = this.arrToString(arr).toLowerCase();
    keywords.store.forEach((elem) => {
      if (str.includes(elem)) {
        // console.log('includes');
        r = elem.replace(/ /g, "");
      }
    })
    return r;
  }

  classifyLine(arr) {
    let price = this.extractPriceFromLine(arr);
    let date = this.extractDateFromLine(arr);
    let store = this.extractStoreFromLine(arr);
    if (price != null) {
      return 0;
      // return this.arrToString(arr) + " " + price; 
    } else if (date != null) {
      return 1;
      // return this.arrToString(arr) + " " + date;
    } else if (store != null) {
      console.log(arr[0].text);
      return 2;
      // return this.arrToString(arr) + " " + store;
    } else {
      return null;
    }
  }

  groupBoxes(arr) {
    var combined = [];
    var temp = null;
    for (i = 0; i < arr.length - 1; i++) {
      var max_spacing = 1 * Math.abs(arr[i].vertices[0].y - arr[i].vertices[2].y);
      if (arr[i].vertices[1].x + max_spacing >= arr[i + 1].vertices[0].x) {
        //combine
        if (temp == null) {
          temp = this.combineBoxes(arr[i], arr[i + 1]);
        } else {
          temp = this.combineBoxes(temp, arr[i + 1]);
        }
      } else {
        if (temp != null) {
          combined.push(temp);
        } else {
          combined.push(arr[i]);
        }
        temp = null;
      }
    }
    if (temp != null) {
      combined.push(temp);
    }
    return combined;
  }

  combineBoxes(obj1, obj2) {
    var newObj = {};
    newObj.avgX = (obj1.avgX + obj2.avgX) / 2;
    newObj.avgY = (obj1.avgY + obj2.avgY) / 2;
    newObj.text = obj1.text + " " + obj2.text;
    newObj.vertices = [obj1.vertices[0], obj2.vertices[1], obj2.vertices[2], obj1.vertices[3]];
    return newObj;
  }
}

export default withNavigation(CameraScreen);
