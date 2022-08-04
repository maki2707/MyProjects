import React, {useEffect, useState} from 'react';
import {
    View,
    Text,
    SafeAreaView,
    FlatList, 
    StyleSheet,     
    Pressable,    
    TextInput,
} from 'react-native';
import { COLORS } from '../../constants';
import { firebase } from '../../firebase';
import { LogBox } from 'react-native';
import { useFonts,} from '@expo-google-fonts/inter';
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
import { AntDesign } from '@expo/vector-icons';
import { deleteRecipe } from '../../Controllers/RecipesController'



const AllRecipes = ({ navigation }) => {
    LogBox.ignoreLogs(['Setting a timer']); 

    const[recipes,setRecipes] = useState([]);
    const[ingredients,setIngredients] = useState([]);
    const[foods,setFoods] = useState([]);
    const[dessert,setDessert]= useState([]);
    const[lunch,setLunch]= useState([]);
    const[breakfast,setBreakfast]= useState([]);
    const[dinner,setDinner]= useState([]);
    const[filteredData, setFilteredData] = useState([]);
    const[search, setSearch] = useState('');
    const recipesRef = firebase.firestore().collection('recipes');
  
   

    useEffect(async ()=> {
        recipesRef
        .orderBy('name')
        .onSnapshot(
        QuerySnapshot => {
            const recipes = []
            QuerySnapshot.forEach((doc) =>{
            const{name, category,cookTime, prepTime, servingSize} = doc.data()

            firebase.firestore().collection('recipes').doc(doc.id)
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
                setIngredients(ingredients) 
                recipes.push({
                    id : doc.id,
                    category,
                    cookTime,
                    name,
                    prepTime,
                    servingSize,
                    ingredients: ingredients,   
                    recipeID: doc.id                                
                }) 
                setRecipes(recipes) 
                setFilteredData(recipes);                                       
            })              
    })})}, []);
    
    const searchFilter = (text) => {
      if(text) {
        const newData = recipes.filter((item) => {
          const itemName = item.name ? item.name.toUpperCase() : ''.toUpperCase;
          const textData = text.toUpperCase();
          return itemName.indexOf(textData) > -1;
        })
        setFilteredData(newData);
        setSearch(text);
      }
      else {
        setFilteredData(recipes);
        setSearch(text);
      }
    }  

     // get all foods
   useEffect(async ()=> {
    firebase.firestore().collection('pantry')
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
   


    return (
        <SafeAreaView style={{backgroundColor: '#F3F2F2',}}>
          <TextInput style={styles.input} value={search} placeholder={"Search"} underlineColorAndroid='transparent' onChangeText={(text)=>searchFilter(text)}
          /> 
          <FlatList
          data={filteredData}
          renderItem= {({ item }) => (   
                <View style={styles.item}>     
                  <Pressable onPress={() => navigation.navigate('RecipeDetails', {navigation, item})} >                         
                      <View style={styles.title}>                        
                          <Text  style={styles.title}>{item.name}</Text> 
                          <AntDesign name="delete" size={24} color="red" onPress={() => deleteRecipe(item)}/>                                                        
                      </View>  
                      <Text  style={styles.details}>vrijeme pripreme: {item.prepTime} min   |    vrijeme kuhanja: {item.cookTime} min</Text>
                      <Text  style={styles.details}>broj obroka: {item.servingSize}   |   kategorija: {item.category}</Text>                    
                  </Pressable>                                 
                </View>  
              )}
              keyExtractor={item => item.id}   
              contentContainerStyle={{ paddingBottom: 170 }} />    
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({      
    item: {
      flexDirection: 'column',
      justifyContent: 'space-between',
      backgroundColor: 'white',
      borderRadius: 5,
      borderBottomColor: COLORS.darkGreen,
      borderColor: COLORS.gray,
      borderBottomWidth: 10,
      borderWidth: 2,
      padding: 20,
      marginVertical: 4,
      marginHorizontal: 10,
    },
    title: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      fontSize: 20,
      fontFamily: 'Roboto_500Medium',
    },
    details: {        
      fontSize: 12,
      fontFamily: 'Roboto_400Regular',
      color: COLORS.gray,
    },
    todoIcon:{
      marginTop:5,
      fontSize:40,
      marginLeft:14,
      zIndex: 0.5,
  },   
  input: {
    height: 50,
    margin: 10,
    borderWidth: 3,
    borderColor: COLORS.gray,
    padding: 10,
    fontFamily: 'Roboto_300Light',
    fontSize: 16,
    borderRadius: 5,
    backgroundColor: 'white'
  },
  });

export default AllRecipes;