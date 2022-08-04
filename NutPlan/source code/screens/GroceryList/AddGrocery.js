import React, {useEffect, useState} from 'react';
import { View, Text, SafeAreaView, StyleSheet, Alert,} from 'react-native';
import { COLORS } from '../../constants';
import { firebase } from '../../firebase';
import {useFonts, Roboto_900Black, Roboto_300Light} from '@expo-google-fonts/roboto';
import AppLoading from 'expo-app-loading';
import { Picker } from '@react-native-picker/picker';
import TextInput from '../../components/TextInput'
import { addNewItemToGrocery } from '../../Controllers/GroceryListController';

const AddGrocery = ({ navigation }) => 
{   

    const[loading, setLoading] = useState(false);

    const [foodData, setFoodData] = useState({
        id: "",
        name: "",
        amount: 0,
        unit: "",       
    });    

    const handleChange = (name, value) => {
        setFoodData({
          ...foodData,
          [name]: value,
        });
      };

    //add food
    



    let [fontsLoaded] = useFonts({       
        Roboto_900Black,
        Roboto_300Light,     
      });

      if (!fontsLoaded) {
        return <AppLoading />;
      }     

    console.log(foodData)
    return (

<SafeAreaView style={{}}>  
         <View style={styles.titleContainer}>           
            <Text style={styles.title}>Dodaj na popis za trgovinu:</Text>           
        </View>  
            <View>
                <TextInput
                    label="Name"
                    returnKeyType="next"
                    defaultValue={foodData.name}
                    mode='outlined' 
                    style={styles.input}  
                    onChangeText={(text) => handleChange('name', text)}         
                />
            
        
                <TextInput
                    label="Amount"
                    returnKeyType="next"
                    defaultValue={foodData.name}
                    mode='outlined' 
                    style={styles.input}  
                    onChangeText={(text) => handleChange('amount', text)}         
                />
               
                   <View style={styles.pickerContainer}>
                      <Picker 
                        style={{width:'75%'}} 
                        selectedValue={foodData.unit}
                        onValueChange={(value) => handleChange('unit', value)}> 
                        <Picker.Item label="litra" value="L" />                       
                        <Picker.Item label="kilogram" value="kg" />
                        <Picker.Item label="gram" value="g" />
                        <Picker.Item label="mililitar" value="mL" />      
                        <Picker.Item label="komad" value="x" />                       
                    </Picker> 
                        <Text style={styles.selectedUnit}> {foodData.unit}</Text>
                    </View>

                    <View style={styles.submitButtonCon}>
                        <Text style={styles.submitButton} onPress={() => addNewItemToGrocery( foodData )}> DODAJ </Text>
                    </View>
                   
            </View>
        </SafeAreaView>


      
    )
}

const styles = StyleSheet.create({
    
    title: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        fontSize: 28,
        fontFamily: 'Roboto_900Black',
        color: COLORS.darkGreen,
        borderColor: COLORS.darkGreen,       
       
    },
    titleContainer:{ 
       flexDirection:'row',
       justifyContent: 'center',
       textAlign: 'center',
       marginBottom: 100,
       marginTop: 5,
       borderBottomColor: COLORS.darkGreen,
       borderBottomWidth: 3,  
       backgroundColor: 'white'         
    },
    input:{
        marginHorizontal: 20,    
        backgroundColor: 'white'  
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
      }    
   })

export default AddGrocery;