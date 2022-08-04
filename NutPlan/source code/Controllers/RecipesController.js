import { firebase } from '../firebase';
import {Alert,} from 'react-native';


export function addIngredient ({foodData, recipeID})
{    
    firebase.firestore()
            .collection('recipes').doc(recipeID).collection('ingredients')
            .add({
            name: foodData.name,
            amount: parseInt(foodData.amount),
            unit: foodData.unit,              
            })
            .then(() => {
            console.log('Item added!');
            
            Alert.alert(
                "Dodano na popis")
            }); 

}


export function addToGrocery (item)
 {    
    console.log("dodajem")
    firebase.firestore()
            .collection('groceryList')
            .add({
              name: item.name,
              amount: parseInt(item.amount),
              unit: item.unit
            })
            .then(() => {            
              Alert.alert(
                "Dodano na popis za kupovinu")
            });

}

  

export function updatePantry({item, oldItem})
{
    
    firebase.firestore()
            .collection('pantry')
            .doc(oldItem.id)
            .update({               
              amount: parseInt(oldItem.amount) - parseInt(item.amount)
            })
            .then(() => {
              Alert.alert(
                "Promijenjena količina na stanju")
            });
  }


export function updateGrocery({item, oldItem2})
{
     
    console.log("updejtam")    
    firebase.firestore()
            .collection('groceryList')
            .doc(oldItem2.id)
            .update({               
              amount: parseInt(item.amount) + oldItem2.amount
            })
            .then(() => {  
              console.log('Item added!');
              Alert.alert(
                "Dodano na popis za kupovinu")
            }); 
  }

export function deleteIngredient(ingredient, recipeID ) 
  {   
    firebase.firestore().collection('recipes')
            .doc(recipeID)
            .collection('ingredients')
            .doc(ingredient.id)
            .delete()
            .then(() => {   
                console.log("obrisano")                    
            })
            .catch(error => {                       
                alert(error);
            })     
  }

export function updateIngredient (recipeID, ingredientID, ingredientData,navigation){  
        
    
    console.log("krece updejt")
    try{
      const ingredientRef = firebase.firestore().collection('recipes').doc(recipeID).collection('ingredients').doc(ingredientID)
      ingredientRef.set(ingredientData, {merge: true})   
      navigation.goBack()
      } 
      catch(error)
      {
          alert(error.message)
      }      
} 

export function addNewRecipe(navigation, recipeData){
    
    console.log("dodajem")
    firebase.firestore()
            .collection('recipes')
            .add({
                name: recipeData.name,
                servingSize : recipeData.servingSize,
                prepTime: recipeData.prepTime,
                cookTime: recipeData.cookTime,
                category: recipeData.category,            
            })
            .then(() => {
            console.log('Item added!');
            Alert.alert(
                "Dodan novi recept")
            }); 

        navigation.goBack()

}

export function deleteRecipe(recipe) 
  {   
    firebase.firestore().collection('recipes')
            .doc(recipe.id)            
            .delete()
            .then(() => {   
                console.log("obrisano")   
                Alert.alert(
                  "Obavijest:",
                  "Uspješno obrisan recept")                 
            })
            .catch(error => {                       
                alert(error);
            })     
  }