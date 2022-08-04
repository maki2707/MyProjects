import React, {useEffect, useState} from 'react';
import { View, StyleSheet, Button, Platform, Text } from 'react-native';
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';
import { firebase } from '../firebase';
import { AntDesign } from '@expo/vector-icons';


const html = `
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
  </head>
  <body style="text-align: center;">
    <h1 style="font-size: 50px; font-family: Helvetica Neue; font-weight: normal;">
      Hello World!
    </h1>
    <img
      src="https://d30j33t1r58ioz.cloudfront.net/static/guides/sdk.png"
      style="width: 90vw;" />
  </body>
</html>
`;

export default function Grocery_export() {
  const [selectedPrinter, setSelectedPrinter] = React.useState();
  const groceryRef = firebase.firestore().collection('groceryList');
  const[grocery, setGrocery] = useState([]);

  const print = async () => {
    await Print.printAsync({
      html: createDynamicTable(),
      printerUrl: selectedPrinter?.url, 
    });
  }

  useEffect(async ()=> {
    groceryRef
    .orderBy('name')
    .onSnapshot(
    QuerySnapshot => {
        const items = []
        QuerySnapshot.forEach((doc) =>{
        const{name, amount, unit} = doc.data()
        items.push({
            id : doc.id,
            name,
            amount,
            unit,               
        })
        })
        setGrocery(items) 
    }) }, []);
 
  const createDynamicTable = () => {
    var table = '';
    for (let i in grocery) {
      const item = grocery[i];
      table = table + `
      <tr>
        <td>${item.name}</td>
        <td>${item.amount}</td>
        <td>${item.unit}</td>
      </tr>
      `
    }
    console.log(table);
    const html = `
    <!DOCTYPE html>
    <html>
      <head>
      <style>
        table {
          font-family: arial, sans-serif;
          border-collapse: collapse;
          width: 75%;
        }
        
        td, th {
          border: 1px solid #dddddd;
          text-align: left;
          padding: 8px;
        }
        
        tr:nth-child(even) {
          background-color: #dddddd;
        }
      </style>
      </head>
      <body>
      
      <h2>Popis za kupovinu</h2>
      
      <table>
        <tr>
          <th>Naziv proizvoda</th>
          <th>Količina</th>
          <th>Mjerna jedinica</th>
        </tr>
        ${table}
      </table>
      
      </body>
    </html>
      `;
    return html;
  }

  return (
    <View>
        <AntDesign name="pdffile1" size={44} color="black" onPress={print} />
    </View>
  );
}

const styles = StyleSheet.create({
  spacer: {
    margin: 5,
  },
})