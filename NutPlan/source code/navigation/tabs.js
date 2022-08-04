import React from "react";
import {
    View,Button
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"

import {Pantry, AllRecipes, GroceryList, MealPlans } from "../screens"
import { COLORS, icons } from "../constants";
import { TabIcon } from "../components";
import {    useFonts,
    Roboto_900Black
  } from '@expo-google-fonts/roboto';
import AppLoading from 'expo-app-loading';
import Grocery_export from "../pdf_export/Grocery_export";
import MealPlan_export from "../pdf_export/MealPlan_export";
import { AntDesign } from '@expo/vector-icons';
import { NavigationContainer } from "@react-navigation/native";
import { SimpleLineIcons } from '@expo/vector-icons';
import { logoutUser } from '../Controllers/AuthController';

const Tab = createBottomTabNavigator()

const Tabs = ( {navigation} ) => {
    let [fontsLoaded] = useFonts({       
        Roboto_900Black,        
      });

      if (!fontsLoaded) {
        return <AppLoading />;
      }
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarShowLabel: false,
                tabBarStyle: {
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    elevation: 0,
                    backgroundColor: COLORS.white,                    
                    height : 80
                }
            }}
            >
            <Tab.Screen
                name="Moji recepti"
                component={AllRecipes}
                options={{
                    tabBarIcon : ({focused}) => <TabIcon focused={focused} icon={icons.recipes} />,
                    headerStyle: {
                        borderBottomColor: COLORS.darkGreen,
                        borderBottomWidth: 2,       
                                         
                    },
                    headerTitleAlign: 'center',
                    headerTintColor: COLORS.darkGreen,
                    headerTitleStyle: {                        
                        fontFamily: 'Roboto_900Black',
                        fontSize: 32
                    },
                    headerRight: () => (
                        <AntDesign name="addfile" size={34} color="black"
                        style={{paddingRight:15,}}
                        onPress={()=>navigation.navigate('GeneralInfoAdd', {})} />
                    ),
                    headerLeft: () => (
                        <SimpleLineIcons name="logout" size={34} color="black" 
                        style={{paddingLeft:15,}} 
                        onPress={()=>logoutUser()}
                        />
                    )
                   
                }}
            />
            <Tab.Screen
                name="Raspored kuhanja"
                component={MealPlans}
                options={{
                    tabBarIcon : ({focused}) => <TabIcon focused={focused} icon={icons.recipeList} />,
                    headerStyle: {
                        borderBottomColor: COLORS.darkGreen,
                        borderBottomWidth: 2,       
                                         
                    },
                    headerTitleAlign: 'center',
                    headerTintColor: COLORS.darkGreen,
                    headerTitleStyle: {                        
                        fontFamily: 'Roboto_900Black',
                        fontSize: 32
                    },
                    headerRight: () => (
                        <MealPlan_export
                        onPress={() => alert('This is a button!')}
                        title="Info"
                        color="#fff"
                        />
                    )
                }}
            />
            <Tab.Screen
                name="Smočnica"
                component={Pantry}
                options={{
                    tabBarIcon : ({focused}) => <TabIcon focused={focused} icon={icons.pantry} />,
                    headerStyle: {
                        borderBottomColor: COLORS.darkGreen,
                        borderBottomWidth: 2,       
                                         
                    },
                    headerTitleAlign: 'center',
                    headerTintColor: COLORS.darkGreen,
                    headerTitleStyle: {                        
                        fontFamily: 'Roboto_900Black',
                        fontSize: 32
                    },
                    

                }}
            />
            <Tab.Screen
                name="Popis za trgovinu"
                component={GroceryList}
                options={{
                    tabBarIcon : ({focused}) => <TabIcon focused={focused} icon={icons.grocery} />,
                    headerStyle: {
                        borderBottomColor: COLORS.darkGreen,
                        borderBottomWidth: 2,       
                                         
                    },
                    headerTitleAlign: 'center',
                    headerTintColor: COLORS.darkGreen,
                    headerTitleStyle: {                        
                        fontFamily: 'Roboto_900Black',
                        fontSize: 32
                    },
                    headerRight: () => (
                        <Grocery_export
                        onPress={() => alert('This is a button!')}
                        title="Info"
                        color="#fff"
                        />
                    )
                }}
            />
        </Tab.Navigator>
    )
}

export default Tabs;