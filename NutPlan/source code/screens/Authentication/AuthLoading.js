import React from 'react'
import { ActivityIndicator } from 'react-native'
import { firebase } from '../../firebase';
import Background from '../../components/Background'
import { CommonActions } from '@react-navigation/native';


const AuthLoading = ({ navigation }) => {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      // User is logged in
      navigation.navigate("Home")
    } else {
      // User is not logged in
      navigation.navigate("Landing")
    }
  })

  return (
    <Background>
      <ActivityIndicator size="large" color='black' />
    </Background>
  )
}

export default AuthLoading;