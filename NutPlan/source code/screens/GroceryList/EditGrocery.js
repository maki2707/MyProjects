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
    Roboto_300Light ,    Roboto_500Medium, 
  } from '@expo-google-fonts/roboto';
import AppLoading from 'expo-app-loading';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { ActivityIndicator } from 'react-native';
import { updateGroceryItem, } from '../../Controllers/GroceryListController'


const EditGrocery = ({ navigation, route }) => {

    const [groceryData, setGroceryData] = useState({
        id: "",
        name: "",
        amount: 0,
        unit: "",
    });    

    const [loading, isLoading] = useState(false);   
  
    const handleChange = (name, value) => {
      setGroceryData({
        ...groceryData,
        [name]: value,
      });
    };

    useEffect(async () => {
        firebase.firestore()
            .collection('groceryList')
            .doc(route.params.item.id)
            .get()
            .then(documentSnapshot => {
                console.log('Food exists: ', documentSnapshot.exists);

                if (documentSnapshot.exists) {
                    const grocery = documentSnapshot.data()     
                    setGroceryData(grocery);                  
                                              
                }
            })
    }, []);

    

    let [fontsLoaded] = useFonts({       
        Roboto_900Black,
        Roboto_300Light,  
        Roboto_500Medium,   
      });

      if (!fontsLoaded) {
        return <AppLoading />;
      }     


    return (
        <SafeAreaView>    
        <View style={styles.titleContainer}>
            <Text style={styles.title}>Uredi podatke za:</Text>
            <Text style={styles.title2}>{groceryData.name}</Text>
        </View>
        
                <TextInput
                    name='name'
                    style={styles.input}    
                    defaultValue={groceryData.name} 
                    onChangeText={(text) => handleChange('name', text)}
                />    
                <TextInput
                    name='amount'
                    style={styles.input}    
                    defaultValue={groceryData.amount.toString()} 
                    onChangeText={(text) => handleChange('amount', text)}
                />  
                <Text style={styles.input}>{groceryData.unit}</Text> 
                   <View style={styles.pickerContainer}>
                      <Picker 
                        style={styles.input}   
                        
                        selectedValue={groceryData.unit}
                        onValueChange={(value) => handleChange('unit', value)}> 
                        <Picker.Item label="litra" value="L" />                       
                        <Picker.Item label="kilogram" value="kg" />
                        <Picker.Item label="gram" value="g" />
                        <Picker.Item label="mililitar" value="mL" />                        
                    </Picker> 
                   </View>          
                  

                  <View style={styles.submitButtonCon}>
                    <Text style={styles.submitButton} onPress={() => updateGroceryItem(navigation, groceryData, route.params.item.id )}> SPREMI </Text>
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
        marginTop: 10,
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


export default EditGrocery;