import React, {useEffect, useState} from 'react';
import {View, Text, SafeAreaView, FlatList, StyleSheet, Pressable, Alert,TextInput} from 'react-native';
import { COLORS, images } from '../../constants';
import { firebase } from '../../firebase';
import { useFonts, Inter_900Black } from '@expo-google-fonts/inter';
import { Roboto_300Light, Roboto_400Regular, Roboto_500Medium, Roboto_700Bold, Roboto_900Black,} from '@expo-google-fonts/roboto';
import AppLoading from 'expo-app-loading';
import { AntDesign } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import AnimatedSplash from "react-native-animated-splash-screen";
import { deleteFromGrocery, buyNewItem, buyExistingItem, deleteFromGroceryList } from '../../Controllers/GroceryListController'


const GroceryList = ({ navigation }) => 
{
  const groceryRef = firebase.firestore().collection('groceryList');
  const[grocery, setGrocery] = useState([]);
  const[filteredData, setFilteredData] = useState([]);
  const[search, setSearch] = useState('');
  const[pantry, setPantry] = useState(''); 
  const[loading, setLoading] = useState(false);
  // get all items
  useEffect(async ()=> {
      groceryRef
      .orderBy('name')
      .onSnapshot(
      QuerySnapshot => {
          const items = []
          QuerySnapshot.forEach((doc) =>{
          const{name, amount, unit} = doc.data()
          items.push({
              id : doc.id,
              name,
              amount,
              unit,               
          })
          })
          setGrocery(items)  
          setFilteredData(items)          
      }) }, []);

  const foodsRef = firebase.firestore().collection('pantry');

  // get all foods
  useEffect(async ()=> {
    foodsRef
    .orderBy('name')
    .onSnapshot(
      QuerySnapshot => {
        const pantry = []
        QuerySnapshot.forEach((doc) =>{
          const{name, amount, unit, lastUpdated} = doc.data()
          pantry.push({
            id : doc.id,
            name,
            amount,
            unit,
            lastUpdated,
          })
        })
        setPantry(pantry)              
      }
    )
  }, [])
 
    //kupljeno
    const handleBuy = ( item ) => 
    {
        if(item)
        {
            const isPresent = pantry.find((o) => o.name === item.name);
            if(isPresent)
            {         
              const oldItem = pantry.find((o) => o.name === item.name);  
              buyExistingItem (item, oldItem);   
              deleteFromGrocery(item);        
            }
            else 
            {      
              buyNewItem(item);   
              deleteFromGrocery(item);                     

            }
        }
    }
    



const searchFilter = (text) => {
    if(text) {
      const newData = grocery.filter((item) => {
        const itemName = item.name ? item.name.toUpperCase() : ''.toUpperCase;
        const textData = text.toUpperCase();
        return itemName.indexOf(textData) > -1;
      })
      setFilteredData(newData);
      setSearch(text);
    }
    else {
      setFilteredData(grocery);
      setSearch(text);
    }
  }


    let [fontsLoaded] = useFonts({     
        Roboto_300Light,    
        Roboto_400Regular,    
        Roboto_500Medium,      
        Roboto_700Bold,      
        Roboto_900Black,      
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
        <SafeAreaView>   
            <View style={{flexDirection: 'row', justifyContent: 'space-between',}}> 
            <TextInput style={styles.input} value={search} placeholder={"Search"} underlineColorAndroid='transparent' onChangeText={(text)=>searchFilter(text)}/> 
            <Ionicons name="add-circle-outline" size={62} color={COLORS.darkGreen} style={{padding:4}} onPress={() => navigation.navigate('AddGrocery', {navigation})} /> 
            </View>        
         <FlatList
            data={filteredData}
            renderItem= {({ item }) => (
              <View style={styles.itemBox}>
              <Pressable                        
                        onPress={() => navigation.navigate('EditGrocery', {navigation, item})}
                        >       
                    <View style={styles.title}>
                        <Text  style={styles.itemText}>{item.name} | <Text  style={styles.itemText}>{item.amount} {item.unit}</Text>
                         </Text>
                         <View style={styles.icons}>
                         <Feather style={styles.todoIcon} name="shopping-cart" size={24} color="green"  onPress={() => handleBuy(item)}/>                
                         <AntDesign style={styles.todoIcon} name="delete" color={'red'} size={24} onPress={() => deleteFromGroceryList(item)}/>                        
                         </View>
                         
                    </View>    
                    </Pressable>                                   
                </View>  
               
            )}

            keyExtractor={item => item.id}   
            contentContainerStyle={{ paddingBottom: 100 }} 
            ListFooterComponent={() => (
        <Text style={{marginBottom:70}}></Text>
      )}       
        />          
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    itemBox:{
        flexDirection: 'column',       
        backgroundColor: COLORS.white,
        borderWidth:2,
        borderStyle: 'dashed',
        borderRadius: 5,
        margin: 4,
        borderColor: COLORS.darkGreen,        
            
    },
    itemText:{
        fontFamily: 'Roboto_500Medium',
        fontSize: 16,  
        margin:5,  
        flexDirection: 'row',
        justifyContent: 'space-around',

    },
    todoIcon:{
        marginTop:5,
        marginLeft:14,
        zIndex: 0.5,
    },
    title: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        fontSize: 25,
        fontFamily: 'Roboto_500Medium',
      },
    icons:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginRight: 15,
      },
    input:{
        height: 50,
        margin: 12,
        borderWidth: 3,
        borderColor: COLORS.gray,
        padding: 10,
        fontFamily: 'Roboto_300Light',
        fontSize: 16,
        borderRadius: 5,
        backgroundColor: 'white',
        width: '75%'
      },
    
});       

export default GroceryList;