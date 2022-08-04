import React, {useEffect, useState} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    StyleSheet,
    Keyboard, 
    Alert,
    Image,
    Button,
    FlatList,
    Pressable,
    TextInput,
} from 'react-native';
import { COLORS } from '../../constants';
import { firebase } from '../../firebase';
import {useFonts,   
    Roboto_900Black,
    Roboto_300Light ,
    Roboto_100Thin,
  } from '@expo-google-fonts/roboto';
import AppLoading from 'expo-app-loading';
import { Feather } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DatePicker from 'react-native-datepicker';
import { addToMealPlans } from '../../Controllers/MealPlansConotroller';

const AddMealPlan = ({ navigation }) => {
    
    const [date, setDate] = useState(new Date());
    const[selectedRecipe, setSelectedRecipe] = useState({
        id:"",
        name:"-",
        date:"",
    })
    const[dateChanged, setDateChanged] = useState(false);
    const foodsRef = firebase.firestore().collection('pantry');
    const[foods,setFoods] = useState([]); 

    const handleRecipeSelect = ( recipe ) => {
        setSelectedRecipe({
            ...selectedRecipe,
            id: recipe.id,
            name: recipe.name,
            date: new Date(date),
        })
        console.log(selectedRecipe);
    }

    
    const recipesRef = firebase.firestore().collection('recipes');
    const[recipes,setRecipes] = useState([]);
    const[ingredients,setIngredients] = useState([]);
    const[filteredData, setFilteredData] = useState([]);
    const[search, setSearch] = useState('');
    const[loading, setLoading] = useState(false);
    const[haveAtHome, setHaveAtHome] = useState([]);

    let dateUpdate = '';
    function datumMake(datum)
    {      
      dateUpdate = datum.getDate()+'.'+(datum.getMonth()+1)+'.'+datum.getFullYear();
      return dateUpdate;        
    } 

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

        let [fontsLoaded] = useFonts({       
            Roboto_100Thin,            
            Roboto_300Light,         
            Roboto_900Black,
              
        });
    
        if (!fontsLoaded) {
            return <AppLoading />;
        }


        const checkIfAtPantry = (item) => {
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

    const setIndicator = ( recipe ) => 
    {
    
        for(let item of recipe.ingredients)
        {
            if(!checkIfAtPantry(item))
            {
                return false;
            }
        }

        const isPresent = haveAtHome.find((o) => o.name === recipe.name);
        if(!isPresent)
        {
          haveAtHome.push(recipe);    
        }          
        
        return true;
    }


    return (
       <SafeAreaView>
            <View style={styles.titleContainer}>           
                <Text style={styles.title}>Planiraj obrok:</Text>           
            </View>           
           <View style={{justifyContent:'center',}}>
           <Text style={styles.inputInfoText}>Odabrani datum</Text>
           
           <DatePicker 
          style={styles.datePickerStyle}
          date={date} //initial date from state
          mode="date" //The enum of date, datetime and time
          placeholder="Odaberi datum"
          format="YYYY-MM-DD"          
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          customStyles={{
              dateInput: {
                  fontSize: 50,
                  height: 50
              },
              dateText:
              {
                  fontSize: 36
              }
          }}
          onDateChange={(date) => {
            setDate(new Date(date));
            setDateChanged(true);
          }}
        />
           </View>
            
            <View style={styles.recipeContainer}>
                <Text style={styles.inputInfoText}>Odaberi recept</Text>
                <Text style={styles.selectedInfo}>{selectedRecipe.name} - {dateChanged ? datumMake(date) : "-"}</Text>
                <Feather style={{ textAlignVertical: "center", textAlign: "center",}} name="save" size={44} color="black" onPress={() => addToMealPlans(selectedRecipe)}/>
                <View style={{borderBottomColor: COLORS.darkGreen, borderBottomWidth: 3,}}/>
                <TextInput style={styles.input} value={search} placeholder={"Search"} underlineColorAndroid='transparent' onChangeText={(text)=>searchFilter(text)}/>
                
                <View style={styles.filterContainer}>
        <Pressable onPress={() => setFilteredData(recipes)} >
        <View >
                        <Text style={styles.filterButton} >       Svi recepti    </Text>
            </View>
        </Pressable>
        <Pressable onPress={() => setFilteredData(haveAtHome)} >
            <View >
                        <Text style={styles.filterButton} >   Imam sastojke    </Text>
            </View>
        </Pressable>
        </View>
           
                 
                <FlatList
                data={filteredData}
                renderItem= {({ item }) => (   
                <View style={styles.item}>     
                <Pressable                        
                            onPress={() => handleRecipeSelect(item)}
                            >                         
                        <View style={styles.titleR}>
                            <Text  style={styles.titleR}>{item.name}</Text> 
                            {/*checkIfAtPantry(item) ? <AntDesign name="checkcircleo" size={16} color="green" /> :<AntDesign name="exclamationcircleo" size={16} color="red" /> */}
                                                             
                        </View>  
                        <Text  style={styles.details}>Prep time: {item.prepTime} min   |   Cook time: {item.cookTime} min</Text>
                        <Text  style={styles.details}>Servings: {item.servingSize}   |   Category: {item.category}</Text>
                        <Text style={styles.details2}>{item.ingredients ? (setIndicator(item) ? "imam sve sastojke" : <Text style={{color: 'red'}}>nemam sve sastojke !</Text>) : "---"}</Text>  
                        
                        </Pressable>                                 
                    </View>  
                )}
                keyExtractor={item => item.id}                   
                ListFooterComponent={() => (
                <Text style={{marginBottom:700}}></Text>
                )}                    
                />                
            </View>
       </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    
    title: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        fontSize: 32,
        fontFamily: 'Roboto_900Black',
        color: COLORS.darkGreen,
        borderColor: COLORS.darkGreen,       
       
    },
    titleContainer:{ 
       flexDirection:'row',
       justifyContent: 'center',
       textAlign: 'center',
       marginBottom: 10,
       marginTop: 5,
       borderBottomColor: COLORS.darkGreen,
       borderBottomWidth: 3,  
       backgroundColor: 'white'         
    },
    input:{
        marginHorizontal: 20,    
        
    },
    inputAkimbo: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        width:'80%',
        backgroundColor: 'white'
        
    },
    pickerContainer:{         
        marginHorizontal:'25%',       
        justifyContent: 'center',     
        flexDirection: 'row',      
        fontFamily: 'Roboto_300Light',
        fontSize: 16,           
        backgroundColor: 'white',
        borderColor: COLORS.darkGreen,
        borderWidth: 2,
        borderRadius: 5,
    
        
      },
      selectedUnit:{
        fontSize: 28,        
        justifyContent: 'center',
        fontFamily: 'Roboto_900Black',
        backgroundColor: 'white',
                
      },
      submitButton:{
        fontFamily: 'Roboto_900Black',
        color: 'white',
        fontSize: 32,       
      },
      submitButtonCon:{
        flexDirection: 'row',
        justifyContent:'center', 
        marginTop: 50,
        marginHorizontal: '25%',
        backgroundColor: COLORS.darkGreen,
        borderRadius: 32,
        borderColor: COLORS.gray,
        borderWidth: 2,

      },
      image:{
          marginRight: 100
      },
      datePickerStyle: {
        width: '75%',
        marginTop: 10,
        marginHorizontal: '15%',
        fontSize: 50
      },
      inputInfoText: {
        textAlignVertical: "center",
        textAlign: "center",
        color: COLORS.darkGreen,
        fontFamily: 'Roboto_300Light',
        fontSize: 22,
      },
      recipeContainer:{
          marginTop: 25,
      },
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
      titleR: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        fontSize: 20,
        fontFamily: 'Roboto_500Medium',
      },
      details: {        
        fontSize: 10,
        fontFamily: 'Roboto_400Regular',
        color: COLORS.gray,
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
        
        },
        selectedInfo:{
            textAlignVertical: "center",
            textAlign: "center",
            color: COLORS.darkGreen,
            fontFamily: 'Roboto_900Black',
            fontSize: 16,
            borderRadius: 5,
            borderColor: 'black',
            borderWidth: 2,
        },
        details2: {        
          fontSize: 12,
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
    fontSize: 16,   
    margin:5,
    width: 150
    },
  filterContainer:{
    flexDirection: 'row',
    margin: 3,
    justifyContent: 'space-around',   
    borderBottomColor: COLORS.gray,
    
  },

    
   })

export default AddMealPlan;