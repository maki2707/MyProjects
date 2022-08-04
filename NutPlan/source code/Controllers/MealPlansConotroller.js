import { firebase } from '../firebase';
import {Alert,} from 'react-native';



export function handleDelete ( plan )
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
    onPress: () => deleteMealPlan(plan) }
  ]
)}
;

export function deleteMealPlan ( plan ) 
{
  firebase.firestore().collection('mealPlans')
  .doc(plan.id)
  .delete()
  .then(() => {
      // show a successful alert
      alert("Deleted successfully");
  })
  .catch(error => {
      // show an error alert
      alert(error);
  })

};

export function addToMealPlans (selectedRecipe)
{     
    console.log("dodajem")
    firebase.firestore()
            .collection('mealPlans')
            .add({
            recipeID: selectedRecipe.id,
            name: selectedRecipe.name,
            date: firebase.firestore.Timestamp.fromDate(selectedRecipe.date),                 
            })
            .then(() => {
            console.log('Item added!');
            Alert.alert(
                "Plan dodan")
            }); 

}