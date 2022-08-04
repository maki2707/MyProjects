import { firebase } from '../firebase';
import {Alert,} from 'react-native';

export function deleteFood(food, foodsRef)
{
    foodsRef
      .doc(food.id)
      .delete()
      .then(() => {           
          Alert.alert("Obavijest:" ,"Uspješno izbrisano sa stanja");
      })
      .catch(error => {      
          alert(error);
      })
}


// alert before deletion
export function handleFoodDelete(food, foodsRef)
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
          onPress: () => deleteFood(food, foodsRef) }
        ]
      );  
}

//add food
export function addNewFoodToPantry(foodData)
{
    console.log("dodajem")
    firebase.firestore()
            .collection('pantry')
            .add({
            name: foodData.name,
            amount: parseInt(foodData.amount),
            unit: foodData.unit,
            lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
            })
            .then(() => {
            console.log('Item added!');
            setLoading(false)
            Alert.alert("Obavijest:",
            "Dodano na stanje.")
            }); 

}

export function updateFood (foodData, docID)
{  
    foodData.lastUpdated = firebase.firestore.FieldValue.serverTimestamp()   
    try{
      const foodRef = firebase.firestore().collection('pantry').doc(docID)
      foodRef.set(foodData, {merge: true})
      .then(() => {
        console.log("updejtano")
        Alert.alert("Obavijest:",
            "Promjena stanja uspješna.")
      })
     
      } 
      catch(error)
      {
          alert(error.message)
      }      
}  