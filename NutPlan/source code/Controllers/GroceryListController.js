import { firebase } from '../firebase';
import {Alert,} from 'react-native';

export function deleteFromGrocery(item) 
{
    firebase.firestore().collection('groceryList')
            .doc(item.id)
            .delete()
            .then(() => {                       
            })
            .catch(error => {                       
                alert(error);
            }) 
}

export function buyItem (item)
{
    console.log("dodajem")
    firebase.firestore()
            .collection('pantry')
            .add({
                name: item.name,
                amount: parseInt(item.amount),
                unit: item.unit,
                lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
            })
            .then(() => {
                console.log('Item added!');                  
            });            
}


export function buyExistingItem (item, oldItem )
{
    let newAmount = 0

    if(item.unit === oldItem.unit)
    {
        newAmount = parseInt(item.amount) + parseInt(oldItem.amount)
    }
    else if(item.amount > oldItem.amount)
    {
        newAmount = parseInt(item.amount)/1000 + oldItem.amount
    }
    else
    {
        newAmount = parseInt(item.amount)*1000 + oldItem.amount
    }
    
  
    console.log("updejtam")    
    firebase.firestore()
            .collection('pantry')
            .doc(oldItem.id)
            .update({               
              amount: newAmount
            })
            .then(() => {
             
              console.log('Item added!');
              Alert.alert(
                "Dodano na stanje")
            });         
}


export function deleteFromGroceryList (item) 
{
    Alert.alert(
        "Upozorenje",
        "Potvrdi brisanje?",
        [        
            {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: 'cancel'            
            },

            { text: "OK", 
            style:'destructive',
            onPress: () =>   
            firebase.firestore().collection('groceryList')
                    .doc(item.id)
                    .delete()
                    .then(() => {
                        // show a successful alert
                        Alert.alert("Obavijest:","Uspješno obrisano!");
                    })
                    .catch(error => {
                        // show an error alert
                        alert(error);
                    }) }
        ]
)}

export function updateGroceryItem (navigation, groceryData, docID )
{         
    console.log("krece updejt")
    try{
      const groceryRef = firebase.firestore().collection('groceryList').doc(docID)
      groceryRef.set(groceryData, {merge: true})   
      console.log("updejtano")
      navigation.goBack()
      } 
      catch(error)
      {
          alert(error.message)
      }      
}  
export function addNewItemToGrocery( foodData )
{        
    firebase.firestore()
            .collection('groceryList')
            .add({
            name: foodData.name,
            amount: parseInt(foodData.amount),
            unit: foodData.unit,              
            })
            .then(() => {
            console.log('Item added!');
            setLoading(false)
            Alert.alert(
                "Dodano na popis")
            }); 

}