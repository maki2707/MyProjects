import React from 'react';
import { Image, StyleSheet } from 'react-native';
import {images, COLORS, SIZES, FONTS} from "../constants";

const Logo = () => {
  return <Image source={images.chefHat} style={styles.image} />
}

const styles = StyleSheet.create({
  image: {
    width: 150,
    height: 150,
    marginBottom: 8,
    borderRadius:20
  },
})
export default Logo;