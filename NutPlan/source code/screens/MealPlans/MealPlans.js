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
    TextInput,
} from 'react-native';
import { COLORS,images } from '../../constants';
import { firebase } from '../../firebase';
import { FontAwesome } from "@expo/vector-icons";
import { LogBox } from 'react-native';
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
import { AntDesign } from '@expo/vector-icons'; 
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import AnimatedSplash from "react-native-animated-splash-screen";
import { MaterialIcons } from '@expo/vector-icons';
import { handleDelete, deleteMealPlan } from '../../Controllers/MealPlansConotroller';

const MealPlans = ({ navigation }) => {

    const[plans,setPlans] = useState('');
    const[futurePlans,setFuturePlans] = useState('');
    const[pastPlans,setPastPlans] = useState('');
    const[recipeToday, setRecipeToday] = useState('');
    const[recipeTodayID, setRecipeTodayID] = useState('');
    const[loading, setLoading] = useState(false);
    const[filteredData, setFilteredData] = useState([]);


    const plansRef = firebase.firestore().collection('mealPlans');   
    const recipeRef = firebase.firestore().collection('recipes');   
    
    
    let dateUpdate = '';
    function datumMake(datum)
    {      
      dateUpdate = datum.getDate()+'/'+(datum.getMonth()+1)+'/'+datum.getFullYear();
      return dateUpdate;        
    } 

    const today = new Date()
    today.setHours(0,0,0,0)
    const tomorrow = new Date(today)     
    tomorrow.setDate(tomorrow.getDate() + 1) 
    tomorrow.setHours(0,0,0,0)
    

    //get all planed days
    useEffect(()=> {
      setLoading(true)     
      plansRef  
      .orderBy('date', 'desc')    
      .onSnapshot(
        QuerySnapshot => {
            const plans = []
            QuerySnapshot.forEach((doc) =>{
            const{recipeID, date} = doc.data()
            plans.push({
                id : doc.id,
                recipeID,
                date,  
            })
            if(datumMake(date.toDate())=== datumMake(today))
            {
              recipeRef
              .doc(recipeID)
              .get(recipeTodayID)
              .then(documentSnapshot => {
                  console.log('Recipe exists: ', documentSnapshot.exists);
                  if (documentSnapshot.exists) {
                      const recipe = documentSnapshot.data() 
                      recipe['recipeID'] = documentSnapshot.id
                      setRecipeToday(recipe)    
                      
                  }}
                  )
            }
            })            
            setPlans(plans)             
            setLoading(false)                                    
        })             
     },[]);    
     

    const getRecipe = ( recipeid ) => {
      recipeRef
        .doc(recipeid)
        .get()
        .then(documentSnapshot => {
            console.log('Recipe exists: ', documentSnapshot.exists);
            if (documentSnapshot.exists) {
                const recipe = documentSnapshot.data()                 
                return recipe;                  
            }}
            )
    } 


    useEffect(()=> {
      setLoading(true)     
      plansRef  
      .where('date', '>', today )    
      .onSnapshot(
        QuerySnapshot => {
            const plans = []
            QuerySnapshot.forEach((doc) =>{
            const{recipeID, date, name} = doc.data()
            if(datumMake(date.toDate()) !== datumMake(today))
            {
              plans.push({
                id : doc.id,
                recipeID,
                date,  
                name,
            })   
            }
                    
            })            
            setFuturePlans(plans)             
            setLoading(false)                                    
        })             
     },[]);

     useEffect(()=> {
      setLoading(true)     
      plansRef  
      .where('date', '<', today )    
      .onSnapshot(
        QuerySnapshot => {
            const plans = []
            QuerySnapshot.forEach((doc) =>{
            const{recipeID, date, name} = doc.data()
            console.log(datumMake(date.toDate()))
            console.log(datumMake(today))
            if(datumMake(date.toDate()) !== datumMake(today))
            {
              plans.push({
                id : doc.id,
                recipeID,
                date,  
                name,
            }) 
            }
                     
            })            
            setPastPlans(plans)             
            setLoading(false)                                    
        })             
     },[]);

    

     
    
   
    
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
    
    console.log(recipeToday)

    return (
        <SafeAreaView style={{backgroundColor: '#F3F2F2',}}> 
        <View style={styles.filterContainer}>
        <Pressable  onPress={() => setFilteredData(futurePlans)} >
        <View style={styles.filterButton} >
                        <Text style={styles.filterButton} >     U planu     </Text>
            </View>
        </Pressable>
        <Pressable  onPress={() => setFilteredData(pastPlans)} >
            <View style={styles.filterButton}>
                        <Text style={styles.filterButton} >     Prošlo     </Text>
            </View>
        </Pressable>
            <Ionicons name="add-circle-outline" size={40} color={COLORS.darkGreen} style={{padding:0}}onPress={() => navigation.navigate('AddMealPlan', {navigation})} /> 
        </View>
        <View style={{borderBottomColor: COLORS.gray, borderBottomWidth: 10,}}/>
        <View style={{borderTopColor: COLORS.darkGreen, borderTopWidth: 5,}}/>
        <View style={styles.todayMeal}>
            <Text style={styles.todayTitle}>DANAS</Text>
        </View>
        <View style={styles.todayItem}>     
               <Pressable                        
                       onPress={() => navigation.navigate('RecipeDetails', {navigation, item : recipeToday})}
                        >                         
                    <View style={styles.title}>
                        <Text  style={styles.title}>{recipeToday.name ? recipeToday.name : 'Ništa isplanirano'} </Text>     
                        <MaterialIcons name="food-bank" size={34} color={COLORS.darkGreen} onPress={() => navigation.navigate('Pantry', {navigation})} />                                                 
                    </View>  
                    <Text  style={styles.details}>Prep time: {recipeToday.prepTime} min   |   Cook time: {recipeToday.cookTime} min</Text>
                    <Text  style={styles.details}>Servings: {recipeToday.servingSize}   |   Category: {recipeToday.category}</Text>
                    
                    </Pressable>                                 
        </View>
        <View style={{borderBottomColor: COLORS.gray, borderBottomWidth: 10,}}/>
        <View style={{borderTopColor: COLORS.darkGreen, borderTopWidth: 5,}}/>

        <FlatList
        data={filteredData}
        renderItem= {({ item }) => (
              <View style={styles.item}>     
               <Pressable                        
                        onPress={() => navigation.navigate('RecipeDetails', {navigation, item})}
                        >                         
                    <View style={styles.title}>
                        <Text  style={styles.title}>{datumMake(item.date.toDate())}</Text>  
                        <AntDesign name="delete" size={24} color="red" onPress={() => handleDelete(item)} />
                                                      
                    </View>   
                    <Text  style={styles.recipeName}><Feather name="arrow-right-circle" size={16} color={COLORS.darkGreen} />  {item.name}</Text>      
                    </Pressable>                                 
                </View>  
            )}
            keyExtractor={item => item.id}   
            contentContainerStyle={{ paddingBottom: 100 }}             
        />           
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
      padding: 10,
      marginVertical: 4,
      marginHorizontal: 10,
      
    },
    todayItem:{
      flexDirection: 'column',
      justifyContent: 'space-between',
      backgroundColor: 'white',
      borderRadius: 5,
      borderBottomColor: COLORS.darkGreen,
      borderColor: COLORS.gray,
      borderBottomWidth: 5,
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
      fontSize: 14,
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
  filterButton:{
    flexDirection: 'row',  
    backgroundColor: COLORS.darkGreen,
    borderRadius: 16,
    borderColor: COLORS.gray,    
    fontFamily: 'Roboto_900Black',
    color: 'white',
    fontSize: 16,   
    margin:5,
    },
  filterContainer:{
    flexDirection: 'row',
    margin: 10,
    justifyContent: 'space-around',   
    borderBottomColor: COLORS.gray,
    
  },
  todayMeal: {
    flexDirection: 'row',
    justifyContent: 'center'

  },
  todayTitle:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 25,
    fontFamily: 'Roboto_900Black',
    color: COLORS.darkGreen
  },
  recipeName:{
    fontSize: 16,   
    fontFamily: 'Roboto_300Light'
  }

  })

export default MealPlans;