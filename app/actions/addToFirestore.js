// const testData = require("../assets/json-files/testItemData.json");
import * as testData from "../assets/json-files/testItemData.json";
import firebase, {firestore} from '../firebase';

export default function addToFirestore(items, cb, loc) {
  // var instance = firestore.collection("user").doc('item1').collection("purchaseInstances").doc("instance2");
  const { currentUser } = firebase.auth();
  firestore.collection(currentUser.uid).get().then((queryItems) => {
    items["items"].forEach((item) => {
      if (queryItems.docs.some((doc) => doc.id === item["name"])) {
        item["instances"].forEach((instance) => {
          firestore.collection(currentUser.uid).doc(item["name"]).update({
            instances: firebase.firestore.FieldValue.arrayUnion(instance)
          });
        });
      } else {
        firestore.collection(currentUser.uid).doc(item["name"]).set(item);
      }
    });
    cb(loc);
  });
}

export function addDefaultData() {
  addToFirestore(testData);
}