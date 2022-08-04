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
import { COLORS } from '../../constants';
import { firebase } from '../../firebase';
import { FontAwesome } from "@expo/vector-icons";
import { LogBox } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { handleFoodDelete, deleteFood } from '../../Controllers/PantryController';


const Pantry = ({ navigation }) => {  
  LogBox.ignoreLogs(['Setting a timer']);

  const[foods,setFoods] = useState([]); 

  const[filteredData, setFilteredData] = useState([]);
  const[search, setSearch] = useState('');
  

  const foodsRef = firebase.firestore().collection('pantry');
  
  useEffect(async ()=> {
    foodsRef.orderBy('name').onSnapshot(
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
        setFilteredData(foods)
      }
    )
  }, [])

  //delete foods  

const searchFilter = (text) => {
  if(text) {
    const newData = foods.filter((item) => {
      const itemName = item.name ? item.name.toUpperCase() : ''.toUpperCase;
      const textData = text.toUpperCase();
      return itemName.indexOf(textData) > -1;
    })
    setFilteredData(newData);
    setSearch(text);
  }
  else {
    setFilteredData(foods);
    setSearch(text);
  }
}
let dateUpdate = '';
function datumMake(datum)
    {      
      dateUpdate = datum.getDate()+'/'+(datum.getMonth()+1)+'/'+datum.getFullYear();
      return dateUpdate;        
    }



      return (        
        <SafeAreaView>  
        <View style={{flexDirection: 'row', justifyContent: 'space-between',}}> 
          <TextInput style={styles.input} value={search} placeholder={"Search"} underlineColorAndroid='transparent' onChangeText={(text)=>searchFilter(text)}/> 
          <Ionicons name="add-circle-outline" size={62} color={COLORS.darkGreen} style={{padding:4}}onPress={() => navigation.navigate('AddFood', {navigation})} />       
        </View>
             
         <FlatList
            data={filteredData}
            renderItem= {({ item }) => (
              <View style={styles.item}>   
                <Pressable                        
                        onPress={() => navigation.navigate('FoodDetail', {navigation, item})}
                        >       
                    <View style={styles.title}>
                        <Text  style={styles.title}>{item.name} | <Text  style={styles.title}>{item.amount} {item.unit}</Text></Text>
                                         
                        <FontAwesome name="trash-o" 
                            color="red" 
                            backgroundColor = "gray"
                            onPress={() => handleFoodDelete(item, foodsRef)}                             
                            style={styles.todoIcon} />         
                    </View>  
                    <View style={styles.title}>
                    <Text style={styles.details}>Last updated: {item.lastUpdated ? datumMake(item.lastUpdated.toDate()) : '-'}</Text>
                   
                    </View> 
                  </Pressable>
                </View>   

            )}

            keyExtractor={item => item.id}   
            contentContainerStyle={{ paddingBottom: 100 }} 
            ListFooterComponent={() => (
        <Text style={{marginBottom:50}}></Text>
      )}       
        />          
        </SafeAreaView>
        
      );
    }
    
    const styles = StyleSheet.create({      
      item: {
        flexDirection: 'column',       
        backgroundColor: COLORS.white,
        borderRadius: 5,
        borderBottomColor: COLORS.darkGreen,
        borderColor: COLORS.gray,
        borderBottomWidth: 10,
        borderWidth: 2,
        padding: 5,
        marginVertical: 4,
        marginHorizontal: 10,
      },
      title: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        fontSize: 14,
        fontFamily: 'Roboto_500Medium',
      },
      details: {        
        fontSize: 10,
        fontFamily: 'Roboto_500Medium',
        color: COLORS.gray
      },
      todoIcon:{
        marginTop:5,
        fontSize:32,
        marginLeft:14,
        zIndex: 0.5,
    },
    input: {
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

export default Pantry;




 

  