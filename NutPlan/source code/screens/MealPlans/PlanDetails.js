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

const PlanDetails = ({ navigation, route }) => {  


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

                
                </View>   

            )}

            keyExtractor={item => item.id}   
            contentContainerStyle={{ paddingBottom: 100 }} 
            ListFooterComponent={() => (
        <Text style={{marginBottom:50}}></Text>
      )}       
        />          
        </SafeAreaView>
    )
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
  filterButton:{
    
  }
  });    

export default PlanDetails;