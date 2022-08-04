import React, {useEffect, useState} from 'react';
import {
    View,
    Text,
    SafeAreaView,
    FlatList, 
    StyleSheet,     
    Pressable,
    TouchableOpacity,    
    TouchableHighlight,
    Alert,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import { COLORS, images } from '../../constants';
import { firebase } from '../../firebase';
import { FontAwesome } from "@expo/vector-icons";
import { LogBox } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFonts, Inter_900Black } from '@expo-google-fonts/inter';
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
import { Shadow } from 'react-native-shadow-2';
import { AntDesign } from '@expo/vector-icons'; 
import { EvilIcons } from '@expo/vector-icons';
import AnimatedSplash from "react-native-animated-splash-screen";

import { deleteIngredient } from '../../Controllers/RecipesController';



const EditIngredients = ({ navigation, route}) => {  
  LogBox.ignoreLogs(['Non-serializable values were found in the navigation state']);

  const foodsRef = firebase.firestore().collection('pantry');
  const recipesRef = firebase.firestore().collection('recipes');
  const[foods,setFoods] = useState([]); 
  const[grocery, setGrocery] = useState([]);
  const[ingredients,setIngredients] = useState([]);
  const[recipe,setRecipe] = useState('');
  const[loading, setLoading] = useState(false);
  const recipeID = route.params.recipeID;
  const[ingredientID, setIngredientID] = useState('');
  const[propData, setPropData] = useState({});
 
 
 
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
  
  const editHandler = ( item ) =>
  {
      setIngredientID(item.id);
      console.log(ingredientID);
      const data = {recipeID: recipeID, ingredientID: item.id}
      console.log(data)
      navigation.navigate('EditSingleIngredient',{navigation, data})
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
                        <Text style={styles.details2}>uređivanje sastojaka</Text>  
                                             
                    </View>  
                    
                    <Text style={{color: 'black', fontFamily:'Roboto_900Black', fontSize:25}} >   Sastojci:</Text>                   
                   

                    <FlatList
                      data={recipe.ingredients}
                      renderItem= {({ item }) => (                
                          <Pressable onPress={() => editHandler( item )}>       
                          <View style={styles.item}>
                                  <Text style={{fontFamily: 'Roboto_700Bold'}}>{item.name} || <Text style={{fontFamily: 'Roboto_700Bold'}}> {item.amount}  {item.unit}</Text></Text> 
                                  <View  style={styles.icons} >    
                                  <AntDesign name="delete" size={24} color="red" onPress={()=> deleteIngredient(item, recipeID)} />                                              
                                  </View>                                
                                  </View>
                          </Pressable>
              
                      )}
                      keyExtractor={item => item.id}   
                      contentContainerStyle={{ paddingBottom: 100 }}                      
                    />     
                    <Pressable onPress={() => navigation.navigate('AddIngredient', {navigation, recipeID})} >
                    <View style={styles.ingredientsButtons}>
                      <Ionicons style={styles.ingredientsIcon} name="add-circle-outline" size={44} color={COLORS.darkGreen}  />
                                          
                    </View>
                    <View style={styles.ingredientsButtons}>
                     
                      <Text style={styles.details3}>Dodaj sastojak</Text>                          
                    </View>
                    </Pressable>
                   
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
    marginTop: 10,
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
    marginBottom: 1,
    
  },
  ingredientsIcon: {
    marginHorizontal: 10,
  },
  details2: {        
    fontSize: 16,
    fontFamily: 'Roboto_400Regular',
    color: COLORS.darkGreen,    
  },   
  details3: {        
    fontSize: 16,
    fontFamily: 'Roboto_700Bold',
    color: COLORS.darkGreen, 
  }}
  );

export default EditIngredients;