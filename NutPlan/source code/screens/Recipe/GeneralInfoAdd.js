import React, {useState} from 'react';
import {
    View,
    Text,
    SafeAreaView,
    StyleSheet,
} from 'react-native';
import { COLORS } from '../../constants';
import {useFonts,   
    Roboto_900Black,
    Roboto_300Light  
  } from '@expo-google-fonts/roboto';
import AppLoading from 'expo-app-loading';
import TextInput from '../../components/TextInput'
import { addNewRecipe } from '../../Controllers/RecipesController';

const GeneralInfoAdd = ({ navigation}) => {   

    const [recipeData, setRecipeData] = useState({
        id: "",
        name:"",
        servingSize : 0,
        prepTime: 0,
        cookTime: 0,
        category: "",       
    });    

    const handleChange = (name, value) => {
        setRecipeData({
          ...recipeData,
          [name]: value,
        });
      };
  
    let [fontsLoaded] = useFonts({       
        Roboto_900Black,
        Roboto_300Light,     
      });

      if (!fontsLoaded) {
        return <AppLoading />;
      }     

    console.log(recipeData)
    return (

<SafeAreaView style={{}}>  
         <View style={styles.titleContainer}>           
            <Text style={styles.title}>Dodavanje novog recepta:</Text>           
        </View>  
            <View>
                <TextInput
                    label="Name"
                    returnKeyType="next"
                    defaultValue={recipeData.name}
                    mode='outlined' 
                    style={styles.input}  
                    onChangeText={(text) => handleChange('name', text)}         
                />           
        
                <TextInput
                    label="Category"
                    returnKeyType="next"
                    defaultValue={recipeData.category}
                    mode='outlined' 
                    style={styles.input}  
                    onChangeText={(text) => handleChange('category', text)}         
                />
                <TextInput
                    label="Vrijeme pripreme"
                    returnKeyType="next"
                    defaultValue={recipeData.prepTime}
                    mode='outlined' 
                    style={styles.input}  
                    onChangeText={(text) => handleChange('prepTime', text)}         
                />
                <TextInput
                    label="Vrijeme kuhanja"
                    returnKeyType="next"
                    defaultValue={recipeData.cookTime}
                    mode='outlined' 
                    style={styles.input}  
                    onChangeText={(text) => handleChange('cookTime', text)}         
                />
                <TextInput
                    label="Broj obroka"
                    returnKeyType="next"
                    defaultValue={recipeData.servingSize}
                    mode='outlined' 
                    style={styles.input}  
                    onChangeText={(text) => handleChange('servingSize', text)}         
                />
                <View style={styles.submitButtonCon}>
                    <Text style={styles.submitButton} onPress={() => addNewRecipe(navigation, recipeData)}> DODAJ </Text>
                </View>                   
            </View>
        </SafeAreaView>


      
    )
}

const styles = StyleSheet.create({
    
    title: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        fontSize: 29,
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

export default GeneralInfoAdd;