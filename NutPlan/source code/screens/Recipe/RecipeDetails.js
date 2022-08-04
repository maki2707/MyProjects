import React, {useEffect, useState} from 'react';
import {View, Text, SafeAreaView, FlatList,StyleSheet,Pressable, Alert,} from 'react-native';
import { COLORS, images } from '../../constants';
import { firebase } from '../../firebase';
import { LogBox } from 'react-native';
import { useFonts } from '@expo-google-fonts/inter';
import {
    Roboto_100Thin,
    Roboto_100Thin_Italic,
    Roboto_300Light,
    Roboto_300Light_Italic,
    Roboto_400Regular,
    Roboto_400Regular_Italic,
    Roboto_500Medium,
    Roboto_500Medium_Italic,
    Roboto_700Bold,
    Roboto_700Bold_Italic,
    Roboto_900Black,
    Roboto_900Black_Italic,
  } from '@expo-google-fonts/roboto';
import AppLoading from 'expo-app-loading';
import { Feather } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons'; 
import { EvilIcons } from '@expo/vector-icons';
import AnimatedSplash from "react-native-animated-splash-screen";
import { addToGrocery, updatePantry, updateGrocery} from '../../Controllers/RecipesController';

const RecipeDetails = ({ navigation, route}) => 
{  
  LogBox.ignoreLogs(['Non-serializable values were found in the navigation state']);

  const foodsRef = firebase.firestore().collection('pantry');
  const recipesRef = firebase.firestore().collection('recipes');
  const[foods,setFoods] = useState([]); 
  const[grocery, setGrocery] = useState([]);
  const[ingredients,setIngredients] = useState([]);
  const[recipe,setRecipe] = useState('');
  const[loading, setLoading] = useState(false);
  const recipeID = route.params.item.recipeID;
 
  useEffect(async () => {
    recipesRef
    .doc(recipeID)
    .get()
    .then(documentSnapshot => {
      const recipe = documentSnapshot.data()       
      firebase.firestore().collection('recipes').doc(recipeID)
            .collection('ingredients')            
            .onSnapshot(
                QuerySnapshot => {
                    const ingredients = []
                    QuerySnapshot.forEach((doc2) =>{
                        const{name, amount, unit } = doc2.data()
                        ingredients.push({
                            id : doc2.id,
                            name,
                            amount,
                            unit,                                    
                        })                                               
                }) 
                recipe.ingredients = ingredients
                setRecipe(recipe)               
    })} )},[]) 

 const getGrocery = async ()=> {
    firebase.firestore().collection('groceryList')
    .orderBy('name')
    .onSnapshot(
      QuerySnapshot => {
        const grocery = []
        QuerySnapshot.forEach((doc) =>{
          const{name, amount, unit,} = doc.data()
          grocery.push({
            id : doc.id,
            name,
            amount,
            unit,             
          })
        })
        setGrocery(grocery)
      })}
      getGrocery(); 

   // get all foods
   useEffect(async ()=> {
    foodsRef
    .orderBy('name')
    .onSnapshot(
      QuerySnapshot => {
        const foods = []
        QuerySnapshot.forEach((doc) =>{
          const{name, amount, unit, lastUpdated} = doc.data()
          foods.push({
            id : doc.id,
            name,
            amount,
            unit,
            lastUpdated,
          })
        })
        setFoods(foods)
      }
    )}, [])

    const checkIfAtGrocery = (item) =>
    {    
        if(item)
        {
          const isPresent = grocery.find((o) => o.name === item.name);
          if(isPresent){ return true; }
          else { return false;}
        }
    }

    const checkIfAtPantry = (item) =>
    {    
        if(item)
        {
          const isPresent = foods.find((o) => o.name === item.name);
          if(isPresent)
          {
            return true;         
          }
          else {
            return false;
          }
        }
    } 

    const handleUpdatePantry = (item1) =>
    {
      const oldItem = foods.find((o) => o.name === item1.name); 
      updatePantry({item1, oldItem })   
    }

    const handleUpdateGrocery = (item) =>
    {
      const oldItem2 = grocery.find((o) => o.name === item.name); 
      updatePantry({item, oldItem2 })   
    }



    const setIndicator = ( allIngredients ) => 
    {    
        for(let item of allIngredients)
        {
            if(!checkIfAtPantry(item, foods))
            {
                return false;
            }
        }

        return true;
    }  

    let [fontsLoaded] = useFonts({       
        Roboto_100Thin,
        Roboto_100Thin_Italic,
        Roboto_300Light,
        Roboto_300Light_Italic,
        Roboto_400Regular,
        Roboto_400Regular_Italic,
        Roboto_500Medium,
        Roboto_500Medium_Italic,
        Roboto_700Bold,
        Roboto_700Bold_Italic,
        Roboto_900Black,
        Roboto_900Black_Italic,  
      });

      if (!fontsLoaded) {
        return <AppLoading />;
      }  
      
    if(loading){
      return <AnimatedSplash
              translucent={true}
              isLoaded={loading}
              logoImage={images.chefHat}
              backgroundColor={COLORS.gray}
              logoHeight={150}
              logoWidth={150}
             />
    }
    
    return (
        <SafeAreaView style={{backgroundColor: '#F3F2F2',}}>                         
                    <View style={styles.titleContainer}>
                        <Text  style={styles.title}>{recipe.name}</Text>   
                        <Text style={styles.details2}>{recipe.ingredients ? (setIndicator(recipe.ingredients) ? "imam sve sastojke" : <Text style={{color: 'red'}}>nemam sve sastojke !</Text>) : "---"}</Text>  
                                             
                    </View>  
                    <Text style={{color: 'black', fontFamily:'Roboto_900Black', fontSize:20}} >   Općenito:</Text>     
                    <View style={styles.recipeGeneral}>
                      <View style={styles.recipeGeneralPart}>
                        <Text  style={styles.details}><Text style={{color: COLORS.darkGreen, fontFamily:'Roboto_900Black'}}>      Prep time: </Text>   {recipe.prepTime} min </Text>                            
                      </View>
                      <View style={styles.recipeGeneralPart}>
                        <Text  style={styles.details}><Text style={{color: COLORS.darkGreen, fontFamily:'Roboto_900Black'}}>      Cook time: </Text>  {recipe.cookTime} min </Text>
                      </View>

                      <View style={styles.recipeGeneralPart}>
                          <Text  style={styles.details}><Text style={{color: COLORS.darkGreen, fontFamily:'Roboto_900Black'}}>      Servings: </Text>     {recipe.servingSize}</Text> 
                      </View>   
                      <View style={styles.recipeGeneralPart}>
                          <Text  style={styles.details}><Text style={{color: COLORS.darkGreen, fontFamily:'Roboto_900Black'}}>      Category: </Text>    {recipe.category}</Text> 
                      </View>                                        
                    </View>  
                    <View style={{ borderBottomColor: 'black', borderBottomWidth: 1, marginTop: 10 }}/>  
                    <Text style={{color: 'black', fontFamily:'Roboto_900Black', fontSize:20}} >   Sastojci:</Text>                   
                   
                    

                    
                    <FlatList
                      data={recipe.ingredients}
                      renderItem= {({ item }) => (                
                          <Pressable>       
                          <View style={styles.item}>
                                  <Text style={{fontFamily: 'Roboto_700Bold'}}>{item.name} || <Text style={{fontFamily: 'Roboto_700Bold'}}> {item.amount}  {item.unit}</Text></Text> 
                                  <View  style={styles.icons} >
                                  
                                  {checkIfAtPantry(item) ? <AntDesign name="checkcircleo" size={16} color="green" /> :<AntDesign name="exclamationcircleo" size={16} color="red" /> }
                                   
                                    <Text>        </Text> 
                                    <Feather name="shopping-cart" size={16} color={COLORS.darkGreen}  onPress={() => checkIfAtGrocery(item) ? handleUpdateGrocery(item) : addToGrocery(item)}/>  
                                    <Text>        </Text>  
                                    {checkIfAtPantry(item) ? <EvilIcons name="minus" size={24} color="red" onPress={() => handleUpdatePantry(item)} /> : <Text>      </Text> } 
                                     
                                                       
                                  </View>
                                
                                  </View>
                          </Pressable>
              
                      )}
                      keyExtractor={item => item.id}   
                      contentContainerStyle={{ paddingBottom: 50 }}                      
                    />        
                    <View style={styles.filterContainer}>
                        <Pressable onPress={() => navigation.navigate('EditIngredients', {navigation, recipeID})}  >
                        <View >
                                        <Text style={styles.filterButton} >    Uredi sastojke    </Text>
                            </View>
                        </Pressable>
                       
                    </View>                          
        </SafeAreaView>
    )
}



const styles = StyleSheet.create({ 
    title: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      fontSize: 32,
      fontFamily: 'Roboto_700Bold',      
    },
    details: {        
      fontSize: 16,
      fontFamily: 'Roboto_400Regular',
      color: COLORS.gray,    
    },   
  titleContainer:{        
    flexDirection: 'column',      
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    marginTop: 25,
    borderBottomColor: COLORS.darkGreen,
    borderBottomWidth: 3,    
    backgroundColor: COLORS.gray2       
  },   
  recipeGeneral:{    
    justifyContent: 'center', 
    alignItems: 'center', 
    flexDirection: 'column',
    borderRadius: 10,   
    borderColor: COLORS.darkGreen,
    borderBottomWidth: 6,
    borderWidth: 5,
    padding: 10,
    
   
    marginHorizontal: 10,    
  },
  recipeGeneralPart:{   
    justifyContent: 'center', 
    borderRadius: 10,
    borderColor: COLORS.gray,
    borderWidth: 2,
    width: '100%',
    margin:5,
    backgroundColor: 'white'
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    borderRadius: 5,
    borderBottomColor: COLORS.darkGreen,
    borderColor: COLORS.gray,
    borderBottomWidth: 5,
    borderWidth: 2,
    padding: 5,
    marginVertical: 5,
    marginHorizontal: 10,
    fontSize: 12,
  }, 
  icons:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginRight: 15,
  },
  spinnerTextStyle: {
    color: '#FFF'
  },
  
  ingredientsButtons:{
    flexDirection:'row',
    justifyContent:"center",
    alignItems:"center",
    marginBottom: 1000,
    
  },
  ingredientsIcon: {
    marginHorizontal: 10,
  },
  details2: {        
    fontSize: 16,
    fontFamily: 'Roboto_400Regular',
    color: COLORS.darkGreen,    
  },   
  filterButton:{
    flexDirection: 'row',  
    backgroundColor: COLORS.darkGreen,
    borderRadius: 16,
    borderColor: COLORS.gray,    
    fontFamily: 'Roboto_900Black',
    color: 'white',
    fontSize: 26,   
    margin:5,
    width: 250,   
    },
  filterContainer:{
    flexDirection: 'row',
    margin: 3,
    justifyContent: 'space-around',   
    borderBottomColor: COLORS.gray,
    marginBottom: 1600,
    
  },
  });

export default RecipeDetails;