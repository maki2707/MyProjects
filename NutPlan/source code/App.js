import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import  Landing from "./screens/Authentication/Landing";
import  Login from './screens/Authentication/Login';
import Register from './screens/Authentication/Register';
import ResetPassword from './screens/Authentication/ResetPassword';
import Tabs from "./navigation/tabs";
import FoodDetail from './screens/Pantry/FoodDetail';
import RecipeDetails from './screens/Recipe/RecipeDetails';
import AddFood from './screens/Pantry/AddFood';
import AddGrocery from './screens/GroceryList/AddGrocery';
import MealPlans  from './screens/MealPlans/MealPlans';
import PlanDetails from './screens/MealPlans/PlanDetails';
import EditGrocery from './screens/GroceryList/EditGrocery';
import AddMealPlan from './screens/MealPlans/AddMealPlan';
import EditIngredients from './screens/Recipe/EditIngredients';
import AddIngredient from './screens/Recipe/AddIngredient';
import EditSingleIngredient from './screens/Recipe/EditSingleIngredient';
import GeneralInfoAdd from './screens/Recipe/GeneralInfoAdd';
import AuthLoading from './screens/Authentication/AuthLoading';
import { AllRecipes } from './screens';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName={'AuthLoading'}>
            <Stack.Screen name="Landing" component={Landing} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="ResetPassword"component={ResetPassword} />
            <Stack.Screen name="Home" component={Tabs} options={{header: () => null}} />
            <Stack.Screen name="FoodDetail" component={FoodDetail} />
            <Stack.Screen name="RecipeDetails" component={RecipeDetails} />
            <Stack.Screen name="AddFood" component={AddFood} />
            <Stack.Screen name="AddGrocery" component={AddGrocery} />
            <Stack.Screen name="MealPlans" component={MealPlans} />
            <Stack.Screen name="PlanDetails" component={PlanDetails} />
            <Stack.Screen name="EditGrocery" component={EditGrocery} />
            <Stack.Screen name="AddMealPlan" component={AddMealPlan} />
            <Stack.Screen name="EditIngredients" component={EditIngredients} />
            <Stack.Screen name="AddIngredient" component={AddIngredient} />
            <Stack.Screen name="EditSingleIngredient" component={EditSingleIngredient} />
            <Stack.Screen name="GeneralInfoAdd" component={GeneralInfoAdd} />
            <Stack.Screen name="AuthLoading" component={AuthLoading} />
            <Stack.Screen name="AllRecipes" component={AllRecipes} />
       
       
        </Stack.Navigator>
    </NavigationContainer>
)
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
