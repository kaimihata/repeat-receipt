import firebase from 'firebase';
import 'firebase/firestore';
import getEnvVars from './environment';

const {
  FB_APIKEY,
  FB_AUTHDOMAIN,
  FB_DATABASEURL,
  FB_PROJECTID,
  FB_STORAGEBUCKET,
  FB_MESSAGINGSENDERID,
  FB_APPID,
} = getEnvVars();


const config = {
  apiKey: FB_APIKEY,
  authDomain: FB_AUTHDOMAIN,
  databaseURL: FB_DATABASEURL,
  projectId: FB_PROJECTID,
  storageBucket: FB_STORAGEBUCKET,
  messagingSenderId: FB_MESSAGINGSENDERID,
  appId: FB_APPID,
};

firebase.initializeApp(config);

export const firestore = firebase.firestore();
export default firebase;
