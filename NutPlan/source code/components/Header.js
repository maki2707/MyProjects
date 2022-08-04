import React from 'react'
import { StyleSheet } from 'react-native'
import { Text } from 'react-native-paper'
import { theme } from '../core/theme'
import {images, COLORS, SIZES, FONTS} from "../constants"
import {useFonts, Roboto_900Black } from '@expo-google-fonts/roboto';
import AppLoading from 'expo-app-loading';

const Header = (props) => {

  let [fontsLoaded] = useFonts({   
    Roboto_900Black  
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return <Text style={styles.header} {...props} />
}

const styles = StyleSheet.create({
  header: {
    fontSize: 30,
    color: COLORS.darkGreen,
    fontWeight: 'bold',
    paddingVertical: 12,
    fontFamily: 'Roboto_900Black'
  },
})

export default Header;