import React, {useEffect, useState} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    TextInput,
    StyleSheet,
    Keyboard
} from 'react-native';
import { COLORS } from '../../constants';
import { firebase } from '../../firebase';
import {useFonts,   
    Roboto_900Black,
    Roboto_300Light  
  } from '@expo-google-fonts/roboto';
import AppLoading from 'expo-app-loading';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { ActivityIndicator } from 'react-native';
import { updateFood } from '../../Controllers/PantryController';



const FoodDetail = ({ navigation, route }) => {      

    const [foodData, setFoodData] = useState({
        id: "",
        name: "",
        amount: 0,
        unit: "",
        lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
    });    
  
    const handleChange = (name, value) => {
      setFoodData({
        ...foodData,
        [name]: value,
      });
    };

         

    useEffect(async () => {
        firebase.firestore()
            .collection('pantry')
            .doc(route.params.item.id)
            .get()
            .then(documentSnapshot => {
                console.log('Food exists: ', documentSnapshot.exists);

                if (documentSnapshot.exists) {
                    const food = documentSnapshot.data()     
                    setFoodData(food);                  
                                              
                }
            })
    }, []);
    let [fontsLoaded] = useFonts({       
        Roboto_900Black,
        Roboto_300Light,     
      });

      if (!fontsLoaded) {
        return <AppLoading />;
      }     


  

    return (
        <SafeAreaView>    
        <View style={styles.titleContainer}>
            <Text style={styles.title}>Uredi podatke za:</Text>
            <Text style={styles.title2}>{foodData.name}</Text>
        </View>
        
                <TextInput
                    name='name'
                    style={styles.input}    
                    defaultValue={foodData.name} 
                    onChangeText={(text) => handleChange('name', text)}
                />    
                <TextInput
                    name='amount'
                    style={styles.input}    
                    defaultValue={foodData.amount.toString()} 
                    onChangeText={(text) => handleChange('amount', text)}
                />  
                <Text style={styles.input}>{foodData.unit}</Text> 
                   <View style={styles.pickerContainer}>
                      <Picker 
                        style={styles.input}   
                        
                        selectedValue={foodData.unit}
                        onValueChange={(value) => handleChange('unit', value)}> 
                        <Picker.Item label="liters" value="L" />                       
                        <Picker.Item label="kilograms" value="kg" />
                        <Picker.Item label="grams" value="g" />
                        <Picker.Item label="mililiters" value="mL" />                        
                    </Picker> 
                   </View>                
                 
                 <View style={styles.submitButtonCon}>
                    <Text style={styles.submitButton} onPress={() => updateFood(foodData, route.params.item.id)}> SPREMI </Text>
                  </View>
                  
                               
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    input: {
      height: 50,
      margin: 12,
      borderWidth: 3,
      borderColor: COLORS.gray,
      padding: 10,
      fontFamily: 'Roboto_300Light',
      fontSize: 16,
      borderRadius: 5,     
    },
    title: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        fontSize: 32,
        fontFamily: 'Roboto_500Medium',  
        color: COLORS.darkGreen  
        
      },
      title2: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        fontSize: 35,
        fontFamily: 'Roboto_900Black',  
        color: COLORS.darkGreen 
        
      },
      titleContainer:{        
        flexDirection: 'column',      
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 50,
        marginTop: 30,
        borderBottomColor: COLORS.darkGreen,
        borderBottomWidth: 3,           
      },
      pickerContainer:{         
        marginHorizontal:'25%',       
        justifyContent: 'center',       
        borderBottomColor: COLORS.gray,
        borderBottomWidth: 3, 
        fontFamily: 'Roboto_300Light',
        fontSize: 16,  
        textAlign: 'center',        
      },
      todoIcon:{
        marginTop:5,
        fontSize:20,
        marginLeft:14,
        zIndex: 0.5,
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


  });

export default FoodDetail;