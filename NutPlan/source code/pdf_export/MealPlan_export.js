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

export default function MealPlan_export() {
  const [selectedPrinter, setSelectedPrinter] = React.useState();
  const plansRef = firebase.firestore().collection('mealPlans');   
  const[futurePlans, setFuturePlans] = useState('');

  const print = async () => {
    // On iOS/android prints the given html. On web prints the HTML from the current page.
    await Print.printAsync({
      html: createDynamicTable(),
      printerUrl: selectedPrinter?.url, // iOS only
    });
  }
  const today = new Date()
  today.setHours(0,0,0,0)

  let dateUpdate = '';
  function datumMake(datum)
  {      
    dateUpdate = datum.getDate()+'/'+(datum.getMonth()+1)+'/'+datum.getFullYear();
    return dateUpdate;        
  } 

  useEffect(()=> {         
    plansRef  
    .where('date', '>', today )    
    .onSnapshot(
      QuerySnapshot => {
          const plans = []
          QuerySnapshot.forEach((doc) =>{
          const{recipeID, date, name} = doc.data()
          plans.push({
              id : doc.id,
              recipeID,
              date,  
              name,
          })           
          })            
          setFuturePlans(plans)             
                                             
      })             
   },[]);
 
  const createDynamicTable = () => {
    var table = '';
    for (let i in futurePlans) 
    {
      const item = futurePlans[i];
      table = table + `
      <tr>
        <td>${datumMake(item.date.toDate())}</td>
        <td>${item.name}</td>      
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
          width: 60%;
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
      
      <h2>Raspored prehrane</h2>
      
      <table>
        <tr>
          <th>Datum</th>
          <th>Jelo</th>
         
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