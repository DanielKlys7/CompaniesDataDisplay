import 'regenerator-runtime/runtime';
import * as firebase from 'firebase';
import dotenv from 'dotenv'
dotenv.config();

const app = firebase.initializeApp({
  apiKey: process.env.FIREBASE_APIKEY,
  authDomain: "companiesdatadisplay.firebaseapp.com",
  databaseURL: "https://companiesdatadisplay.firebaseio.com",
  projectId: "companiesdatadisplay",
  storageBucket: "companiesdatadisplay.appspot.com",
  messagingSenderId: "774587025538",
  appId: "1:774587025538:web:b3fa122cd4181970fd0c9b"
});

const db = firebase.firestore();

export const updateFirebaseCollection = (arrayOfItems) => {
  arrayOfItems.forEach(item => {
    db.collection('companies').doc(`${item.id}`).set({
      id: item.id,
      name: item.name,
      city: item.city,
      incomes: item.incomes,
      totalIncome: item.totalIncome
    })
  })
}

export const getFirebaseCollection = async () => {
  let sortedCompaniesArray = []
  await db.collection('companies').get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        sortedCompaniesArray.push(doc.data());
      });
    })
    .catch(err => {
      throw new Error('Error getting document', err);
    });
  return sortedCompaniesArray;
}






